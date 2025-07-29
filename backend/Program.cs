using OpenAI;
using OpenAI.Chat;
using Microsoft.Extensions.Configuration;
using CoverLetterGen.Models;
using CoverLetterGen.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using CoverLetterGen;
using System.Web;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/coverlettergen-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddScoped<IDataService, DataService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=coverlettergen.db"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var environment = builder.Environment.EnvironmentName;

// Read JWT secret from environment variable or config
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? builder.Configuration["Jwt:Secret"];
if (string.IsNullOrEmpty(jwtSecret) && !builder.Environment.IsDevelopment())
{
    throw new Exception("JWT secret must be set in production via environment variable JWT_SECRET.");
}

// Read OpenAI API key from environment variable or config
var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? builder.Configuration["OpenAI:ApiKey"];
if (string.IsNullOrEmpty(openAiApiKey) && !builder.Environment.IsDevelopment())
{
    throw new Exception("OpenAI API key must be set in production via environment variable OPENAI_API_KEY.");
}

// Add CORS policy for localhost and Vercel
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins(
            builder.Environment.IsDevelopment()
                ? new[] { "http://localhost:5173", "https://coverlettergen.vercel.app" }
                : new[] { "https://coverlettergen.vercel.app" }
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

// Add global exception handling
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Unhandled exception occurred: {Message}", ex.Message);
        
        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(new { error = "An unexpected error occurred" });
    }
});

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Health check endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});
app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = _ => false
});

// Add logging middleware
app.Use(async (context, next) =>
{
    var start = DateTime.UtcNow;
    Log.Information("Request started: {Method} {Path}", context.Request.Method, context.Request.Path);
    
    await next();
    
    var elapsed = DateTime.UtcNow - start;
    Log.Information("Request completed: {Method} {Path} - {StatusCode} in {Elapsed}ms", 
        context.Request.Method, context.Request.Path, context.Response.StatusCode, elapsed.TotalMilliseconds);
});

// Helper: Get user from JWT token
UserDto? GetUserFromToken(HttpContext http)
{
    try
    {
        var authHeader = http.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            return null;

        var token = authHeader.Substring("Bearer ".Length);
        var authService = http.RequestServices.GetRequiredService<IAuthService>();
        return authService.GetUserFromTokenAsync(token).Result;
    }
    catch
    {
        return null;
    }
}

// Helper: Check Freemium limits
bool CheckFreemiumLimit(IDataService dataService, string email)
{
    var monthlyUsage = dataService.GetMonthlyUsageAsync(email, DateTime.UtcNow).Result;
    return monthlyUsage < 3; // Free tier limit
}

// Authentication endpoints
app.MapPost("/auth/register", async (HttpContext http, IAuthService authService, IEmailService emailService) =>
{
    try
    {
        var request = await http.Request.ReadFromJsonAsync<RegisterRequest>();
        if (request == null)
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Invalid request data." });
            return;
        }

        var response = await authService.RegisterAsync(request);
        
        // Send welcome email
        await emailService.SendWelcomeEmailAsync(request.Email, request.FirstName);
        
        await http.Response.WriteAsJsonAsync(response);
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 400;
        await http.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
});

app.MapPost("/auth/login", async (HttpContext http, IAuthService authService) =>
{
    try
    {
        var request = await http.Request.ReadFromJsonAsync<LoginRequest>();
        if (request == null)
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Invalid request data." });
            return;
        }

        var response = await authService.LoginAsync(request);
        await http.Response.WriteAsJsonAsync(response);
    }
    catch (InvalidOperationException ex)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Login failed." });
    }
});

app.MapPost("/auth/refresh", async (HttpContext http, IAuthService authService) =>
{
    try
    {
        var request = await http.Request.ReadFromJsonAsync<RefreshTokenRequest>();
        if (request == null)
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Invalid request data." });
            return;
        }

        var response = await authService.RefreshTokenAsync(request.RefreshToken);
        await http.Response.WriteAsJsonAsync(response);
    }
    catch (InvalidOperationException ex)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Token refresh failed." });
    }
});

app.MapGet("/auth/me", async (HttpContext http, IAuthService authService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Unauthorized." });
        return;
    }

    await http.Response.WriteAsJsonAsync(user);
});

// Implement /generate endpoint with authentication and Freemium logic
app.MapPost("/generate", async (HttpContext http, IDataService dataService, IConfiguration config) =>
{
    try
    {
        var request = await http.Request.ReadFromJsonAsync<GenerateRequest>();
        if (request == null || string.IsNullOrWhiteSpace(request.JobTitle) || string.IsNullOrWhiteSpace(request.CompanyName) || string.IsNullOrWhiteSpace(request.UserInfo))
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Missing required fields." });
            return;
        }

        var user = GetUserFromToken(http);
        if (user == null)
        {
            http.Response.StatusCode = 401;
            await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
            return;
        }

        // Check Freemium limits
        if (!CheckFreemiumLimit(dataService, user.Email))
        {
            http.Response.StatusCode = 402; // Payment Required
            await http.Response.WriteAsJsonAsync(new { 
                error = "Monthly limit exceeded. Upgrade to Pro for unlimited cover letters.",
                monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result,
                limit = 3
            });
            return;
        }

        // TODO: Fix OpenAI SDK integration
        // var client = new OpenAIClient(openAiApiKey);
        // var tone = request.Tone ?? "professional";
        // var experienceLevel = request.ExperienceLevel ?? "mid-level";
        // var language = request.Language ?? "en";

        // var systemPrompt = $"You are a helpful assistant that writes {tone} cover letters for {experienceLevel} remote jobs.";
        // var userPrompt = $"Write a {tone} cover letter for the following {experienceLevel} remote job. Job Title: {request.JobTitle}. Company: {request.CompanyName}. Candidate Info: {request.UserInfo}.";

        // if (language != "en")
        // {
        //     systemPrompt += $" Write the cover letter in {language} language.";
        //     userPrompt += $" Please write the cover letter in {language} language.";
        // }

        // // Use the simplest possible approach for OpenAI SDK 2.2.0
        // var messages = new List<ChatMessage>
        // {
        //     new ChatMessage { Role = "system", Content = systemPrompt },
        //     new ChatMessage { Role = "user", Content = userPrompt }
        // };

        // var chatResponse = await client.GetChatCompletionsAsync("gpt-3.5-turbo", messages);
        // string coverLetterText = chatResponse.Value.Choices[0].Message.Content.Trim();

        // Temporary mock response for now
        string coverLetterText = $"Dear Hiring Manager at {request.CompanyName},\n\nI am writing to express my interest in the {request.JobTitle} position at {request.CompanyName}. {request.UserInfo}\n\nSincerely,\n[Your Name]";

        // Save to history
        var coverLetter = new CoverLetter
        {
            Title = $"{request.JobTitle} at {request.CompanyName}",
            Content = coverLetterText,
            UserId = user.Id,
            Tone = request.Tone ?? "professional",
            ExperienceLevel = request.ExperienceLevel ?? "mid-level",
            Language = request.Language ?? "en",
            TokensUsed = null // Temporarily disabled due to SDK changes
        };
        dataService.AddCoverLetterAsync(coverLetter).Wait();

        await http.Response.WriteAsJsonAsync(new {
            coverLetter = coverLetterText,
            monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result,
            limit = 3,
            tokensUsed = 0 // Temporarily set to 0
        });
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Failed to generate cover letter." });
    }
});

// Multilingual generation endpoint
app.MapPost("/generate/{language}", async (HttpContext http, string language, IDataService dataService, IConfiguration config) =>
{
    try
    {
        var request = await http.Request.ReadFromJsonAsync<GenerateRequest>();
        if (request == null || string.IsNullOrWhiteSpace(request.JobTitle) || string.IsNullOrWhiteSpace(request.CompanyName) || string.IsNullOrWhiteSpace(request.UserInfo))
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Missing required fields." });
            return;
        }

        var user = GetUserFromToken(http);
        if (user == null)
        {
            http.Response.StatusCode = 401;
            await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
            return;
        }

        // Check Freemium limits
        if (!CheckFreemiumLimit(dataService, user.Email))
        {
            http.Response.StatusCode = 402;
            await http.Response.WriteAsJsonAsync(new { 
                error = "Monthly limit exceeded. Upgrade to Pro for unlimited cover letters.",
                monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result,
                limit = 3
            });
            return;
        }

        // TODO: Fix OpenAI SDK integration
        // var client = new OpenAIClient(openAiApiKey);
        // var tone = request.Tone ?? "professional";
        // var experienceLevel = request.ExperienceLevel ?? "mid-level";

        // var systemPrompt = $"You are a helpful assistant that writes {tone} cover letters for {experienceLevel} remote jobs. Write the cover letter in {language} language.";
        // var userPrompt = $"Write a {tone} cover letter in {language} language for the following {experienceLevel} remote job. Job Title: {request.JobTitle}. Company: {request.CompanyName}. Candidate Info: {request.UserInfo}.";

        // // Use the simplest possible approach for OpenAI SDK 2.2.0
        // var messages = new List<ChatMessage>
        // {
        //     new ChatMessage { Role = "system", Content = systemPrompt },
        //     new ChatMessage { Role = "user", Content = userPrompt }
        // };

        // var chatResponse = await client.GetChatCompletionsAsync("gpt-3.5-turbo", messages);
        // string coverLetterText = chatResponse.Value.Choices[0].Message.Content.Trim();

        // Temporary mock response for now
        string coverLetterText = $"Dear Hiring Manager at {request.CompanyName},\n\nI am writing to express my interest in the {request.JobTitle} position at {request.CompanyName} in {language} language. {request.UserInfo}\n\nSincerely,\n[Your Name]";

        // Save to history
        var coverLetter = new CoverLetter
        {
            Title = $"{request.JobTitle} at {request.CompanyName}",
            Content = coverLetterText,
            UserId = user.Id,
            Tone = request.Tone ?? "professional",
            ExperienceLevel = request.ExperienceLevel ?? "mid-level",
            Language = language,
            TokensUsed = null // Temporarily disabled due to SDK changes
        };
        dataService.AddCoverLetterAsync(coverLetter).Wait();

        await http.Response.WriteAsJsonAsync(new {
            coverLetter = coverLetterText,
            monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result,
            limit = 3,
            tokensUsed = 0 // Temporarily set to 0
        });
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Failed to generate cover letter." });
    }
});

// Cover letter management endpoints (require authentication)
app.MapGet("/coverletters", async (HttpContext http, IDataService dataService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetters = dataService.GetCoverLettersByUserIdAsync(user.Id).Result;
    await http.Response.WriteAsJsonAsync(coverLetters);
});

app.MapDelete("/coverletters/{id}", async (HttpContext http, int id, IDataService dataService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = dataService.GetCoverLetterByIdAsync(id).Result;
    if (coverLetter == null || coverLetter.UserId != user.Id)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "Cover letter not found." });
        return;
    }

    var success = dataService.DeleteCoverLetterAsync(id).Result;
    if (success)
    {
        await http.Response.WriteAsJsonAsync(new { message = "Cover letter deleted successfully." });
    }
    else
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Failed to delete cover letter." });
    }
});

// Analytics endpoint (require authentication)
app.MapGet("/analytics", async (HttpContext http, IDataService dataService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result;
    var coverLetters = dataService.GetCoverLettersByUserIdAsync(user.Id).Result;

    await http.Response.WriteAsJsonAsync(new
    {
        monthlyUsage,
        limit = 3,
        isPro = user.IsPro,
        totalLetters = coverLetters.Count,
        lettersThisMonth = monthlyUsage
    });
});

// Other endpoints (PDF, email, share, etc.) - require authentication
app.MapGet("/coverletters/{id}/pdf", async (HttpContext http, int id, IDataService dataService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = dataService.GetCoverLetterByIdAsync(id).Result;
    if (coverLetter == null || coverLetter.UserId != user.Id)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "Cover letter not found." });
        return;
    }

    // Generate a very basic PDF file (text only, no formatting)
    // This is a minimal PDF file structure
    var sb = new System.Text.StringBuilder();
    sb.AppendLine("%PDF-1.1");
    sb.AppendLine("1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj");
    sb.AppendLine("2 0 obj <</Type /Pages /Kids [3 0 R] /Count 1>> endobj");
    sb.AppendLine("3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj");
    var text = coverLetter.Content.Replace("(", "\\(").Replace(")", "\\)").Replace("\r", "").Replace("\n", "\\n");
    var content = $"BT /F1 12 Tf 72 720 Td ({text}) Tj ET";
    sb.AppendLine($"4 0 obj <</Length {content.Length}>> stream");
    sb.AppendLine(content);
    sb.AppendLine("endstream endobj");
    sb.AppendLine("5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj");
    sb.AppendLine("xref");
    sb.AppendLine("0 6");
    sb.AppendLine("0000000000 65535 f ");
    sb.AppendLine("0000000010 00000 n ");
    sb.AppendLine("0000000079 00000 n ");
    sb.AppendLine("0000000178 00000 n ");
    sb.AppendLine("0000000401 00000 n ");
    sb.AppendLine("0000000500 00000 n ");
    sb.AppendLine("trailer <</Size 6/Root 1 0 R>>");
    sb.AppendLine("startxref");
    sb.AppendLine("600");
    sb.AppendLine("%%EOF");
    var pdfBytes = System.Text.Encoding.ASCII.GetBytes(sb.ToString());
    http.Response.ContentType = "application/pdf";
    http.Response.Headers.Add("Content-Disposition", $"attachment; filename=cover-letter-{id}.pdf");
    await http.Response.Body.WriteAsync(pdfBytes, 0, pdfBytes.Length);
});

app.MapPost("/coverletters/{id}/send-email", async (HttpContext http, int id, IDataService dataService, IEmailService emailService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = dataService.GetCoverLetterByIdAsync(id).Result;
    if (coverLetter == null || coverLetter.UserId != user.Id)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "Cover letter not found." });
        return;
    }

    try
    {
        // Extract job title and company from cover letter title
        var titleParts = coverLetter.Title.Split(" at ");
        var jobTitle = titleParts.Length > 0 ? titleParts[0] : "Unknown Position";
        var companyName = titleParts.Length > 1 ? titleParts[1] : "Unknown Company";

        // Send email using SendGrid
        var emailSent = await emailService.SendCoverLetterEmailAsync(
            user.Email, 
            coverLetter.Content, 
            jobTitle, 
            companyName
        );

        if (emailSent)
        {
            await http.Response.WriteAsJsonAsync(new { 
                message = "Cover letter sent successfully to your email.",
                email = user.Email
            });
        }
        else
        {
            http.Response.StatusCode = 500;
            await http.Response.WriteAsJsonAsync(new { error = "Failed to send email. Please try again." });
        }
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Failed to send email. Please try again." });
    }
});

app.MapPost("/coverletters/{id}/share", async (HttpContext http, int id, IDataService dataService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = dataService.GetCoverLetterByIdAsync(id).Result;
    if (coverLetter == null || coverLetter.UserId != user.Id)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "Cover letter not found." });
        return;
    }

    var shareId = Guid.NewGuid().ToString("N")[..8];
    await http.Response.WriteAsJsonAsync(new { 
        shareUrl = $"http://localhost:5173/share/{shareId}",
        shareId = shareId
    });
});

app.MapGet("/share/{shareId}", async (HttpContext http, string shareId) =>
{
    // Mock shared cover letter
    await http.Response.WriteAsJsonAsync(new { 
        title = "Sample Cover Letter",
        content = "This is a sample shared cover letter.",
        createdAt = DateTime.UtcNow
    });
});

app.MapGet("/languages", async (HttpContext http) =>
{
    await http.Response.WriteAsJsonAsync(new[]
    {
        new { code = "en", name = "English", flag = "🇺🇸" },
        new { code = "de", name = "German", flag = "🇩🇪" },
        new { code = "es", name = "Spanish", flag = "🇪🇸" },
        new { code = "fr", name = "French", flag = "🇫🇷" }
    });
});

app.MapPost("/upgrade", async (HttpContext http, IDataService dataService, IEmailService emailService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    // Mock upgrade to Pro
    var dbUser = dataService.GetUserByEmailAsync(user.Email).Result;
    if (dbUser != null)
    {
        dbUser.IsPro = true;
        dbUser.ProExpiresAt = DateTime.UtcNow.AddYears(1);
        dataService.UpdateUserAsync(dbUser).Wait();
    }

    // Send pro upgrade email
    await emailService.SendProUpgradeEmailAsync(user.Email, user.FirstName);

    await http.Response.WriteAsJsonAsync(new { message = "Successfully upgraded to Pro!" });
});

app.MapGet("/team", async (HttpContext http) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    // Mock team data
    await http.Response.WriteAsJsonAsync(new { members = new object[0] });
});

app.MapPost("/team", async (HttpContext http) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    // Mock team member addition
    await http.Response.WriteAsJsonAsync(new { message = "Team member added successfully!" });
});

// Gumroad webhook endpoint for payment verification and user upgrade
app.MapPost("/gumroad/webhook", async (HttpContext http, IDataService dataService) =>
{
    // Parse Gumroad webhook POST (x-www-form-urlencoded)
    var form = await http.Request.ReadFormAsync();
    var email = form["email"].ToString().ToLower();
    var productId = form["product_id"].ToString();
    var purchaseId = form["purchase_id"].ToString();
    var isRefunded = form["refunded"].ToString() == "true";
    // TODO: Validate webhook signature if secret is set
    if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(productId) || string.IsNullOrEmpty(purchaseId))
    {
        http.Response.StatusCode = 400;
        await http.Response.WriteAsJsonAsync(new { error = "Missing required fields." });
        return;
    }
    var user = dataService.GetUserByEmailAsync(email).Result;
    if (user == null)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "User not found." });
        return;
    }
    if (isRefunded)
    {
        user.IsPro = false;
        user.ProSubscriptionId = null;
        user.ProExpiresAt = null;
    }
    else
    {
        user.IsPro = true;
        user.ProSubscriptionId = purchaseId;
        user.ProExpiresAt = DateTime.UtcNow.AddYears(1); // 1 year Pro by default
    }
    dataService.UpdateUserAsync(user).Wait();
    await http.Response.WriteAsJsonAsync(new { message = "User Pro status updated." });
});

// Payment webhook endpoints
app.MapPost("/webhooks/gumroad", async (HttpContext http, IPaymentService paymentService) =>
{
    try
    {
        // Read the raw body for signature verification
        using var reader = new StreamReader(http.Request.Body);
        var body = await reader.ReadToEndAsync();
        
        // Parse form data
        var formData = System.Web.HttpUtility.ParseQueryString(body);
        
        var request = new GumroadWebhookRequest
        {
            ProductId = formData["product_id"] ?? "",
            Email = formData["email"] ?? "",
            PriceInCents = formData["price_in_cents"] ?? "",
            Currency = formData["currency"] ?? "",
            Quantity = formData["quantity"] ?? "",
            ProductName = formData["product_name"] ?? "",
            TransactionId = formData["transaction_id"] ?? "",
            Variant = formData["variant"] ?? "",
            Test = formData["test"] ?? "",
            Recurrence = formData["recurrence"] ?? "",
            IsGift = formData["is_gift"] ?? "",
            Refunded = formData["refunded"] ?? "",
            PartialRefunded = formData["partial_refunded"] ?? "",
            Chargedback = formData["chargedback"] ?? "",
            Pending = formData["pending"] ?? "",
            SubscriptionId = formData["subscription_id"] ?? "",
            CustomerId = formData["customer_id"] ?? "",
            IpCountry = formData["ip_country"] ?? "",
            IpCountryCode = formData["ip_country_code"] ?? "",
            IpCity = formData["ip_city"] ?? "",
            Ip = formData["ip"] ?? "",
            UserAgent = formData["user_agent"] ?? "",
            Referer = formData["referer"] ?? "",
            OrderId = formData["order_id"] ?? "",
            Disputed = formData["disputed"] ?? "",
            DisputeWon = formData["dispute_won"] ?? "",
            Id = formData["id"] ?? "",
            CreatedAt = formData["created_at"] ?? "",
            UpdatedAt = formData["updated_at"] ?? "",
            SubscriptionEndDate = formData["subscription_end_date"] ?? "",
            CancelledAt = formData["cancelled_at"] ?? "",
            CancelReason = formData["cancel_reason"] ?? "",
            CustomFields = formData["custom_fields"] ?? "",
            Metadata = formData["metadata"] ?? "",
            Timestamp = formData["timestamp"] ?? "",
            Signature = formData["signature"] ?? ""
        };

        // Verify webhook signature
        var signature = http.Request.Headers["X-Gumroad-Signature"].FirstOrDefault() ?? "";
        var isValid = await paymentService.VerifyGumroadWebhookAsync(request, signature);

        if (!isValid)
        {
            http.Response.StatusCode = 401;
            await http.Response.WriteAsJsonAsync(new { error = "Invalid webhook signature" });
            return;
        }

        // Process the payment
        var success = await paymentService.ProcessPaymentAsync(request);
        
        if (success)
        {
            http.Response.StatusCode = 200;
            await http.Response.WriteAsJsonAsync(new { message = "Payment processed successfully" });
        }
        else
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Failed to process payment" });
        }
    }
    catch (Exception ex)
    {
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Internal server error" });
    }
});

// Subscription status endpoint
app.MapGet("/subscription/status", async (HttpContext http, IPaymentService paymentService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required" });
        return;
    }

    var status = await paymentService.GetSubscriptionStatusAsync(user.Email);
    await http.Response.WriteAsJsonAsync(status);
});

// Cancel subscription endpoint
app.MapPost("/subscription/cancel", async (HttpContext http, IPaymentService paymentService) =>
{
    var user = GetUserFromToken(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required" });
        return;
    }

    var success = await paymentService.CancelSubscriptionAsync(user.Email);
    
    if (success)
    {
        await http.Response.WriteAsJsonAsync(new { message = "Subscription cancelled successfully" });
    }
    else
    {
        http.Response.StatusCode = 400;
        await http.Response.WriteAsJsonAsync(new { error = "Failed to cancel subscription" });
    }
});

app.Run();
