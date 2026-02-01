using OpenAI.Chat;
using CoverLetterGen.Models;
using CoverLetterGen.Services;
using Microsoft.EntityFrameworkCore;
using CoverLetterGen;
using System.Web;
using Serilog;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;

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

// Configure Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "CoverLetterAuth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.ExpireTimeSpan = TimeSpan.FromDays(30);
        options.SlidingExpiration = true;
        options.LoginPath = "/auth/login";
        options.LogoutPath = "/auth/logout";
        options.AccessDeniedPath = "/auth/access-denied";
    });

builder.Services.AddAuthorization();

// Add Antiforgery for CSRF protection
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "CSRF-TOKEN";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=coverlettergen.db"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

var environment = builder.Environment.EnvironmentName;

// Read OpenAI API key from environment variable or config
var openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? builder.Configuration["OpenAI:ApiKey"];
if (string.IsNullOrEmpty(openAiApiKey))
{
    if (builder.Environment.IsDevelopment())
    {
        openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? "";
    }
    else
    {
        throw new Exception("OpenAI API key must be set in production via environment variable OPENAI_API_KEY.");
    }
}

// Add OpenAI API key to configuration
builder.Configuration["OpenAI:ApiKey"] = openAiApiKey;

// Add CORS policy for localhost and Vercel
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = new[]
        {
            "http://localhost:5173", // Vite dev server
            "https://coverlettergen.vercel.app" // Production frontend
        };

        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // Important for cookies
    });
});

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

// Use CORS
app.UseCors("AllowFrontend");

// Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

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

// Configure Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Health check endpoints
app.MapGet("/", () => Results.Ok("CoverLetterGen Backend is Live & Running!"));
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

// Helper: Get user from cookie authentication
async Task<UserDto?> GetUserFromCookieAsync(HttpContext http)
{
    try
    {
        if (http.User.Identity?.IsAuthenticated == true)
        {
            var email = http.User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            if (!string.IsNullOrEmpty(email))
            {
                var dataService = http.RequestServices.GetRequiredService<IDataService>();
                var user = await dataService.GetUserByEmailAsync(email);
                if (user != null)
                {
                    return new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        CreatedAt = user.CreatedAt,
                        IsPro = user.IsPro,
                        ProExpiresAt = user.ProExpiresAt
                    };
                }
            }
        }
        return null;
    }
    catch
    {
        return null;
    }
}

// Helper: Check Freemium limits
async Task<bool> CheckFreemiumLimitAsync(IDataService dataService, string email)
{
    // First check if user is Pro
    var user = await dataService.GetUserByEmailAsync(email);
    if (user != null && user.IsPro && (user.ProExpiresAt == null || user.ProExpiresAt > DateTime.UtcNow))
    {
        // Pro users have unlimited access
        return true;
    }
    
    // For free users, check monthly usage limit
    var monthlyUsage = await dataService.GetMonthlyUsageAsync(email, DateTime.UtcNow);
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
        
        // Set authentication cookie
        var claims = new List<System.Security.Claims.Claim>
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, response.User.Id.ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, response.User.Email),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, $"{response.User.FirstName} {response.User.LastName}")
        };

        var identity = new System.Security.Claims.ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new System.Security.Claims.ClaimsPrincipal(identity);

        await http.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTime.UtcNow.AddDays(30)
        });
        
        await http.Response.WriteAsJsonAsync(new { 
            success = true, 
            user = response.User,
            message = "Registration successful"
        });
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

        // Set authentication cookie
        var claims = new List<System.Security.Claims.Claim>
        {
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, response.User.Id.ToString()),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, response.User.Email),
            new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, $"{response.User.FirstName} {response.User.LastName}")
        };

        var identity = new System.Security.Claims.ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new System.Security.Claims.ClaimsPrincipal(identity);

        await http.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTime.UtcNow.AddDays(30)
        });

        await http.Response.WriteAsJsonAsync(new { 
            success = true, 
            user = response.User,
            message = "Login successful"
        });
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
        Log.Error(ex, "Login failed: {Message}", ex.Message);
    }
});

app.MapPost("/auth/logout", async (HttpContext http) =>
{
    await http.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    await http.Response.WriteAsJsonAsync(new { success = true, message = "Logout successful" });
});

app.MapGet("/auth/me", async (HttpContext http, IAuthService authService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Unauthorized." });
        return;
    }

    await http.Response.WriteAsJsonAsync(user);
});

app.MapGet("/auth/validate", async (HttpContext http, IAuthService authService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        await http.Response.WriteAsJsonAsync(new { valid = false });
        return;
    }

    await http.Response.WriteAsJsonAsync(new { valid = true, user });
});

// Implement /generate endpoint WITH authentication
app.MapPost("/generate", async (HttpContext http, IDataService dataService, IConfiguration config) =>
{
    string coverLetterText = "";
    try
    {
        var request = await http.Request.ReadFromJsonAsync<GenerateRequest>();
        if (request == null || string.IsNullOrWhiteSpace(request.JobTitle) || string.IsNullOrWhiteSpace(request.CompanyName) || string.IsNullOrWhiteSpace(request.UserInfo))
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Missing required fields." });
            return;
        }

        var user = await GetUserFromCookieAsync(http);
        if (user == null)
        {
            http.Response.StatusCode = 401;
            await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
            return;
        }

        if (!await CheckFreemiumLimitAsync(dataService, user.Email))
        {
            http.Response.StatusCode = 402; // Payment Required
            await http.Response.WriteAsJsonAsync(new { 
                error = "Monthly limit exceeded. Upgrade to Pro for unlimited cover letters.",
                monthlyUsage = await dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow),
                limit = 3
            });
            return;
        }

        var client = new ChatClient("gpt-4o-mini", openAiApiKey);

        var tone = request.Tone ?? "professional";
        var experienceLevel = request.ExperienceLevel ?? "mid-level";
        var language = request.Language ?? "en";

        var messages = new List<ChatMessage>();

        var systemPrompt = $"You are a helpful assistant that writes {tone} cover letters for {experienceLevel} remote jobs.";
        if (language != "en")
        {
            systemPrompt += $" Write the cover letter in {language} language.";
        }
        messages.Add(new SystemChatMessage(systemPrompt));
        
        var userPrompt = $"Write a {tone} cover letter for the following {experienceLevel} remote job. Job Title: {request.JobTitle}. Company: {request.CompanyName}. Candidate Info: {request.UserInfo}.";
        if (language != "en")
        {
            userPrompt += $" Please write the cover letter in {language} language.";
        }
        messages.Add(new UserChatMessage(userPrompt));

        var response = await client.CompleteChatAsync(messages);
        coverLetterText = response.Value.Content.Last().Text;

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
        await dataService.AddCoverLetterAsync(coverLetter);

        await http.Response.WriteAsJsonAsync(new {
            coverLetter = coverLetterText,
            monthlyUsage = await dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow),
            limit = 3,
            tokensUsed = 0 // Temporarily set to 0
        });
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Cover letter generation failed: {Message}", ex.Message);
        
        // Check for specific OpenAI API errors
        if (ex.Message.Contains("insufficient_quota") || ex.Message.Contains("quota"))
        {
            http.Response.StatusCode = 503; // Service Unavailable
            await http.Response.WriteAsJsonAsync(new { 
                error = "OpenAI API quota exceeded. Please try again later or contact support.",
                details = "The AI service is temporarily unavailable due to quota limits.",
                actualError = ex.Message
            });
        }
        else if (ex.Message.Contains("rate_limit") || ex.Message.Contains("429"))
        {
            http.Response.StatusCode = 429; // Too Many Requests
            await http.Response.WriteAsJsonAsync(new { 
                error = "Rate limit exceeded. Please wait a moment and try again.",
                details = "Too many requests to the AI service."
            });
        }
        else
        {
            http.Response.StatusCode = 500;
            await http.Response.WriteAsJsonAsync(new { 
                error = "Failed to generate cover letter.",
                details = ex.Message,
                type = ex.GetType().Name
            });
        }
    }
});

// Multilingual generation endpoint - WITH authentication
app.MapPost("/generate/{language}", async (HttpContext http, string language, IDataService dataService, IConfiguration config) =>
{
    string coverLetterText = "";
    try
    {
        var request = await http.Request.ReadFromJsonAsync<GenerateRequest>();
        if (request == null || string.IsNullOrWhiteSpace(request.JobTitle) || string.IsNullOrWhiteSpace(request.CompanyName) || string.IsNullOrWhiteSpace(request.UserInfo))
        {
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Missing required fields." });
            return;
        }

        var user = await GetUserFromCookieAsync(http);
        if (user == null)
        {
            http.Response.StatusCode = 401;
            await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
            return;
        }

        if (!await CheckFreemiumLimitAsync(dataService, user.Email))
        {
            http.Response.StatusCode = 402;
            await http.Response.WriteAsJsonAsync(new { 
                error = "Monthly limit exceeded. Upgrade to Pro for unlimited cover letters.",
                monthlyUsage = await dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow),
                limit = 3
            });
            return;
        }

        var client = new ChatClient("gpt-4o-mini", openAiApiKey);

        var tone = request.Tone ?? "professional";
        var experienceLevel = request.ExperienceLevel ?? "mid-level";

        var systemPrompt = $"You are a helpful assistant that writes {tone} cover letters for {experienceLevel} remote jobs. Write the cover letter in {language} language.";
        var userPrompt = $"Write a {tone} cover letter in {language} language for the following {experienceLevel} remote job. Job Title: {request.JobTitle}. Company: {request.CompanyName}. Candidate Info: {request.UserInfo}.";

        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userPrompt)
        };

        var response = await client.CompleteChatAsync(messages);
        coverLetterText = response.Value.Content.Last().Text;

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
        await dataService.AddCoverLetterAsync(coverLetter);

        await http.Response.WriteAsJsonAsync(new {
            coverLetter = coverLetterText,
            monthlyUsage = await dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow),
            limit = 3,
            tokensUsed = 0 // Temporarily set to 0
        });
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Multilingual cover letter generation failed: {Message}", ex.Message);
        
        // Check for specific OpenAI API errors
        if (ex.Message.Contains("insufficient_quota") || ex.Message.Contains("quota"))
        {
            http.Response.StatusCode = 503; // Service Unavailable
            await http.Response.WriteAsJsonAsync(new { 
                error = "OpenAI API quota exceeded. Please try again later or contact support.",
                details = "The AI service is temporarily unavailable due to quota limits."
            });
        }
        else if (ex.Message.Contains("rate_limit") || ex.Message.Contains("429"))
        {
            http.Response.StatusCode = 429; // Too Many Requests
            await http.Response.WriteAsJsonAsync(new { 
                error = "Rate limit exceeded. Please wait a moment and try again.",
                details = "Too many requests to the AI service."
            });
        }
        else
        {
            http.Response.StatusCode = 500;
            await http.Response.WriteAsJsonAsync(new { 
                error = "Failed to generate cover letter.",
                details = ex.Message,
                type = ex.GetType().Name
            });
        }
    }
});

// Cover letter management endpoints (require authentication)
app.MapGet("/coverletters", async (HttpContext http, IDataService dataService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetters = await dataService.GetCoverLettersByUserIdAsync(user.Id);
    
    // Create DTOs to avoid circular references
    var coverLetterDtos = coverLetters.Select(cl => new
    {
        cl.Id,
        cl.Title,
        cl.Content,
        cl.CreatedAt,
        cl.UserId,
        cl.Tone,
        cl.ExperienceLevel,
        cl.Language,
        cl.TokensUsed
    }).ToList();
    
    await http.Response.WriteAsJsonAsync(coverLetterDtos);
});

app.MapDelete("/coverletters/{id}", async (HttpContext http, int id, IDataService dataService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = await dataService.GetCoverLetterByIdAsync(id);
    if (coverLetter == null || coverLetter.UserId != user.Id)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "Cover letter not found." });
        return;
    }

    var success = await dataService.DeleteCoverLetterAsync(id);
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
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var monthlyUsage = await dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow);
    var coverLetters = await dataService.GetCoverLettersByUserIdAsync(user.Id);

    await http.Response.WriteAsJsonAsync(new
    {
        monthlyUsage,
        limit = 3,
        isPro = user.IsPro,
        totalLetters = coverLetters.Count,
        lettersThisMonth = monthlyUsage,
        lettersGeneratedThisMonth = monthlyUsage,
        plan = user.IsPro ? "Pro" : "Free",
        remainingLetters = user.IsPro ? "Unlimited" : Math.Max(0, 3 - monthlyUsage).ToString()
    });
});

// Other endpoints (PDF, email, share, etc.) - require authentication
app.MapGet("/coverletters/{id}/pdf", async (HttpContext http, int id, IDataService dataService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = await dataService.GetCoverLetterByIdAsync(id);
    if (coverLetter == null || coverLetter.UserId != user.Id)
    {
        http.Response.StatusCode = 404;
        await http.Response.WriteAsJsonAsync(new { error = "Cover letter not found." });
        return;
    }

    try
    {
        // Generate PDF using iText7
        using var memoryStream = new MemoryStream();
        using var writer = new iText.Kernel.Pdf.PdfWriter(memoryStream);
        using var pdf = new iText.Kernel.Pdf.PdfDocument(writer);
        using var document = new iText.Layout.Document(pdf);

        // Add title
        var title = new iText.Layout.Element.Paragraph(coverLetter.Title ?? "Cover Letter")
            .SetFontSize(18)
            .SetBold()
            .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
        document.Add(title);

        // Add spacing
        document.Add(new iText.Layout.Element.Paragraph(""));

        // Add content with proper formatting
        if (!string.IsNullOrEmpty(coverLetter.Content))
        {
            var content = new iText.Layout.Element.Paragraph(coverLetter.Content)
                .SetFontSize(12)
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED);
            document.Add(content);
        }

        // Add footer with generation info
        var footer = new iText.Layout.Element.Paragraph($"Generated on {coverLetter.CreatedAt:MMMM dd, yyyy}")
            .SetFontSize(10)
            .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
            .SetItalic();
        document.Add(footer);

        document.Close();

        var pdfBytes = memoryStream.ToArray();
        
        // Set proper headers
        http.Response.ContentType = "application/pdf";
        http.Response.Headers["Content-Disposition"] = $"attachment; filename=cover-letter-{id}.pdf";
        http.Response.Headers["Content-Length"] = pdfBytes.Length.ToString();
        
        // Write PDF bytes
        await http.Response.Body.WriteAsync(pdfBytes, 0, pdfBytes.Length);
        
        Log.Information("PDF generated successfully for cover letter {Id}", id);
    }
    catch (Exception ex)
    {
        Log.Error(ex, "PDF generation failed for cover letter {Id}: {Message}", id, ex.Message);
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Failed to generate PDF. Please try again." });
    }
});

// Email and share endpoints
app.MapPost("/coverletters/{id}/send-email", async (HttpContext http, int id, IDataService dataService, IEmailService emailService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = await dataService.GetCoverLetterByIdAsync(id);
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
        Log.Error(ex, "Email sending failed: {Message}", ex.Message);
    }
});

app.MapPost("/coverletters/{id}/share", async (HttpContext http, int id, IDataService dataService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    var coverLetter = await dataService.GetCoverLetterByIdAsync(id);
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

// Upgrade and team endpoints
app.MapPost("/upgrade", async (HttpContext http, IDataService dataService, IEmailService emailService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required." });
        return;
    }

    // Mock upgrade to Pro
    var dbUser = await dataService.GetUserByEmailAsync(user.Email);
    if (dbUser != null)
    {
        dbUser.IsPro = true;
        dbUser.ProExpiresAt = DateTime.UtcNow.AddYears(1);
        await dataService.UpdateUserAsync(dbUser);
    }

    // Send pro upgrade email
    await emailService.SendProUpgradeEmailAsync(user.Email, user.FirstName);

    await http.Response.WriteAsJsonAsync(new { message = "Successfully upgraded to Pro!" });
});

app.MapGet("/team", async (HttpContext http) =>
{
    var user = await GetUserFromCookieAsync(http);
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
    var user = await GetUserFromCookieAsync(http);
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
    var user = await dataService.GetUserByEmailAsync(email);
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
    await dataService.UpdateUserAsync(user);
    await http.Response.WriteAsJsonAsync(new { message = "User Pro status updated." });
});

// Payment webhook endpoints
app.MapPost("/webhooks/gumroad", async (HttpContext http, IPaymentService paymentService) =>
{
    try
    {
        Console.WriteLine("=== GUMROAD WEBHOOK RECEIVED ===");
        
        // Read the raw body for signature verification
        using var reader = new StreamReader(http.Request.Body);
        var body = await reader.ReadToEndAsync();
        
        Console.WriteLine($"Webhook body: {body}");
        
        // Parse form data
        var formData = System.Web.HttpUtility.ParseQueryString(body);
        
        var request = new GumroadWebhookRequest
        {
            ProductId = formData["product_id"] ?? "",
            Email = formData["email"] ?? "",
            PriceInCents = formData["price"] ?? "",
            Currency = formData["currency"] ?? "",
            Quantity = formData["quantity"] ?? "",
            ProductName = formData["product_name"] ?? "",
            TransactionId = formData["sale_id"] ?? "",
            Variant = formData["variants[Tier]"] ?? "",
            Test = formData["test"] ?? "",
            Recurrence = formData["recurrence"] ?? "",
            IsGift = formData["is_gift_receiver_purchase"] ?? "",
            Refunded = formData["refunded"] ?? "",
            PartialRefunded = formData["partial_refunded"] ?? "",
            Chargedback = formData["chargedback"] ?? "",
            Pending = formData["pending"] ?? "",
            SubscriptionId = formData["subscription_id"] ?? "",
            CustomerId = formData["purchaser_id"] ?? "",
            IpCountry = formData["ip_country"] ?? "",
            IpCountryCode = formData["ip_country_code"] ?? "",
            IpCity = formData["ip_city"] ?? "",
            Ip = formData["ip"] ?? "",
            UserAgent = formData["user_agent"] ?? "",
            Referer = formData["referrer"] ?? "",
            OrderId = formData["order_number"] ?? "",
            Disputed = formData["disputed"] ?? "",
            DisputeWon = formData["dispute_won"] ?? "",
            Id = formData["sale_id"] ?? "",
            CreatedAt = formData["sale_timestamp"] ?? "",
            UpdatedAt = formData["sale_timestamp"] ?? "",
            SubscriptionEndDate = formData["subscription_end_date"] ?? "",
            CancelledAt = formData["cancelled_at"] ?? "",
            CancelReason = formData["cancel_reason"] ?? "",
            CustomFields = formData["custom_fields"] ?? "",
            Metadata = formData["metadata"] ?? "",
            Timestamp = formData["sale_timestamp"] ?? "",
            Signature = formData["signature"] ?? ""
        };

        Console.WriteLine($"Processing payment for email: {request.Email}");
        Console.WriteLine($"Product ID: {request.ProductId}");
        Console.WriteLine($"Product Name: {request.ProductName}");
        Console.WriteLine($"Transaction ID: {request.TransactionId}");

        // Verify webhook signature
        var signature = http.Request.Headers["X-Gumroad-Signature"].FirstOrDefault() ?? "";
        var isValid = await paymentService.VerifyGumroadWebhookAsync(request, signature);

        if (!isValid)
        {
            Console.WriteLine("Webhook signature verification failed");
            http.Response.StatusCode = 401;
            await http.Response.WriteAsJsonAsync(new { error = "Invalid webhook signature" });
            return;
        }

        // Process the payment
        var success = await paymentService.ProcessPaymentAsync(request);
        
        if (success)
        {
            Console.WriteLine("Payment processed successfully");
            http.Response.StatusCode = 200;
            await http.Response.WriteAsJsonAsync(new { message = "Payment processed successfully" });
        }
        else
        {
            Console.WriteLine("Failed to process payment");
            http.Response.StatusCode = 400;
            await http.Response.WriteAsJsonAsync(new { error = "Failed to process payment" });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Webhook processing error: {ex.Message}");
        http.Response.StatusCode = 500;
        await http.Response.WriteAsJsonAsync(new { error = "Internal server error" });
        Log.Error(ex, "Payment webhook processing failed: {Message}", ex.Message);
    }
});

// Subscription endpoints
app.MapGet("/subscription/status", async (HttpContext http, IPaymentService paymentService) =>
{
    var user = await GetUserFromCookieAsync(http);
    if (user == null)
    {
        http.Response.StatusCode = 401;
        await http.Response.WriteAsJsonAsync(new { error = "Authentication required" });
        return;
    }

    var status = await paymentService.GetSubscriptionStatusAsync(user.Email);
    await http.Response.WriteAsJsonAsync(status);
});

app.MapPost("/subscription/cancel", async (HttpContext http, IPaymentService paymentService) =>
{
    var user = await GetUserFromCookieAsync(http);
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
