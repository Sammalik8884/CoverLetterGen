# Enable OpenAI Integration Script
# Uncomments and fixes OpenAI SDK integration in Program.cs

Write-Host "Enabling OpenAI Integration" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Backup the original file
$backupFile = "backend/Program.cs.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
Copy-Item "backend/Program.cs" $backupFile
Write-Host "Backup created: $backupFile" -ForegroundColor Yellow

# Read the current Program.cs file
$programContent = Get-Content "backend/Program.cs" -Raw

Write-Host "`nAnalyzing current OpenAI integration..." -ForegroundColor Cyan

# Check if OpenAI integration is commented out
if ($programContent -match "// TODO: Fix OpenAI SDK integration") {
    Write-Host "Found commented OpenAI integration code" -ForegroundColor Yellow
} else {
    Write-Host "OpenAI integration code not found or already enabled" -ForegroundColor Green
}

# Check for OpenAI API key configuration
if ($programContent -match "openAiApiKey = ""sk-proj-") {
    Write-Host "Found development OpenAI API key" -ForegroundColor Yellow
} else {
    Write-Host "No development OpenAI API key found" -ForegroundColor Red
}

Write-Host "`nEnabling OpenAI integration..." -ForegroundColor Cyan

# Uncomment and fix the OpenAI integration code
$updatedContent = $programContent -replace `
    "// TODO: Fix OpenAI SDK integration.*?// var client = new OpenAIClient\(openAiApiKey\);", `
    "// OpenAI SDK integration enabled
        var client = new OpenAIClient(openAiApiKey);"

$updatedContent = $updatedContent -replace `
    "// var tone = request\.Tone \?\? ""professional"";.*?// var language = request\.Language \?\? ""en"";", `
    "var tone = request.Tone ?? ""professional"";
        var experienceLevel = request.ExperienceLevel ?? ""mid-level"";
        var language = request.Language ?? ""en"";"

$updatedContent = $updatedContent -replace `
    "// var systemPrompt = \`".*?\`";.*?// var userPrompt = \`".*?\`";", `
    "var systemPrompt = \`"You are a helpful assistant that writes \${tone} cover letters for \${experienceLevel} remote jobs.\`;
        var userPrompt = \`"Write a \${tone} cover letter for the following \${experienceLevel} remote job. Job Title: \${request.JobTitle}. Company: \${request.CompanyName}. Candidate Info: \${request.UserInfo}.\`;"

$updatedContent = $updatedContent -replace `
    "// if \(language != ""en""\).*?// }", `
    "if (language != ""en"")
        {
            systemPrompt += \`" Write the cover letter in \${language} language.\`;
            userPrompt += \`" Please write the cover letter in \${language} language.\`;
        }"

$updatedContent = $updatedContent -replace `
    "// // Use the simplest possible approach for OpenAI SDK 2\.2\.0.*?// var messages = new List<ChatMessage>.*?// };", `
    "// Use the simplest possible approach for OpenAI SDK 2.2.0
        var messages = new List<ChatMessage>
        {
            new ChatMessage { Role = ""system"", Content = systemPrompt },
            new ChatMessage { Role = ""user"", Content = userPrompt }
        };"

$updatedContent = $updatedContent -replace `
    "// var chatResponse = await client\.GetChatCompletionsAsync.*?// string coverLetterText = chatResponse\.Value\.Choices\[0\]\.Message\.Content\.Trim\(\);", `
    "var chatResponse = await client.GetChatCompletionsAsync(""gpt-3.5-turbo"", messages);
        string coverLetterText = chatResponse.Value.Choices[0].Message.Content.Trim();"

$updatedContent = $updatedContent -replace `
    "// Temporary mock response for now.*?string coverLetterText = \`".*?\`";", `
    "// OpenAI generated response
        // string coverLetterText = \`"Dear Hiring Manager at \${request.CompanyName},\\n\\nI am writing to express my interest in the \${request.JobTitle} position at \${request.CompanyName}. \${request.UserInfo}\\n\\nSincerely,\\n[Your Name]\`";"

$updatedContent = $updatedContent -replace `
    "// Save to history.*?// TokensUsed = null // Temporarily disabled due to SDK changes", `
    "// Save to history
        var coverLetter = new CoverLetter
        {
            Title = \`"\${request.JobTitle} at \${request.CompanyName}\`,
            Content = coverLetterText,
            UserId = user.Id,
            Tone = request.Tone ?? ""professional"",
            ExperienceLevel = request.ExperienceLevel ?? ""mid-level"",
            Language = request.Language ?? ""en"",
            TokensUsed = chatResponse.Value.Usage.TotalTokens
        };
        dataService.AddCoverLetterAsync(coverLetter).Wait();"

$updatedContent = $updatedContent -replace `
    "await http\.Response\.WriteAsJsonAsync\(new \{.*?tokensUsed = 0 // Temporarily set to 0.*?\}\);", `
    "await http.Response.WriteAsJsonAsync(new {
            coverLetter = coverLetterText,
            monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result,
            limit = 3,
            tokensUsed = chatResponse.Value.Usage.TotalTokens
        });"

# Also fix the multilingual generation endpoint
$updatedContent = $updatedContent -replace `
    "// TODO: Fix OpenAI SDK integration.*?// var client = new OpenAIClient\(openAiApiKey\);", `
    "// OpenAI SDK integration enabled
        var client = new OpenAIClient(openAiApiKey);"

$updatedContent = $updatedContent -replace `
    "// TODO: Fix OpenAI SDK integration.*?// var tone = request\.Tone \?\? ""professional"";.*?// var experienceLevel = request\.ExperienceLevel \?\? ""mid-level"";", `
    "// OpenAI SDK integration enabled
        var client = new OpenAIClient(openAiApiKey);
        var tone = request.Tone ?? ""professional"";
        var experienceLevel = request.ExperienceLevel ?? ""mid-level"";"

$updatedContent = $updatedContent -replace `
    "// var systemPrompt = \`".*?\`";.*?// var userPrompt = \`".*?\`";", `
    "var systemPrompt = \`"You are a helpful assistant that writes \${tone} cover letters for \${experienceLevel} remote jobs. Write the cover letter in \${language} language.\`;
        var userPrompt = \`"Write a \${tone} cover letter in \${language} language for the following \${experienceLevel} remote job. Job Title: \${request.JobTitle}. Company: \${request.CompanyName}. Candidate Info: \${request.UserInfo}.\`;"

$updatedContent = $updatedContent -replace `
    "// // Use the simplest possible approach for OpenAI SDK 2\.2\.0.*?// var messages = new List<ChatMessage>.*?// };", `
    "// Use the simplest possible approach for OpenAI SDK 2.2.0
        var messages = new List<ChatMessage>
        {
            new ChatMessage { Role = ""system"", Content = systemPrompt },
            new ChatMessage { Role = ""user"", Content = userPrompt }
        };"

$updatedContent = $updatedContent -replace `
    "// var chatResponse = await client\.GetChatCompletionsAsync.*?// string coverLetterText = chatResponse\.Value\.Choices\[0\]\.Message\.Content\.Trim\(\);", `
    "var chatResponse = await client.GetChatCompletionsAsync(""gpt-3.5-turbo"", messages);
        string coverLetterText = chatResponse.Value.Choices[0].Message.Content.Trim();"

$updatedContent = $updatedContent -replace `
    "// Temporary mock response for now.*?string coverLetterText = \`".*?\`";", `
    "// OpenAI generated response
        // string coverLetterText = \`"Dear Hiring Manager at \${request.CompanyName},\\n\\nI am writing to express my interest in the \${request.JobTitle} position at \${request.CompanyName} in \${language} language. \${request.UserInfo}\\n\\nSincerely,\\n[Your Name]\`";"

$updatedContent = $updatedContent -replace `
    "// Save to history.*?// TokensUsed = null // Temporarily disabled due to SDK changes", `
    "// Save to history
        var coverLetter = new CoverLetter
        {
            Title = \`"\${request.JobTitle} at \${request.CompanyName}\`,
            Content = coverLetterText,
            UserId = user.Id,
            Tone = request.Tone ?? ""professional"",
            ExperienceLevel = request.ExperienceLevel ?? ""mid-level"",
            Language = language,
            TokensUsed = chatResponse.Value.Usage.TotalTokens
        };
        dataService.AddCoverLetterAsync(coverLetter).Wait();"

$updatedContent = $updatedContent -replace `
    "await http\.Response\.WriteAsJsonAsync\(new \{.*?tokensUsed = 0 // Temporarily set to 0.*?\}\);", `
    "await http.Response.WriteAsJsonAsync(new {
            coverLetter = coverLetterText,
            monthlyUsage = dataService.GetMonthlyUsageAsync(user.Email, DateTime.UtcNow).Result,
            limit = 3,
            tokensUsed = chatResponse.Value.Usage.TotalTokens
        });"

# Write the updated content back to the file
Set-Content -Path "backend/Program.cs" -Value $updatedContent

Write-Host "`nOpenAI integration code has been enabled!" -ForegroundColor Green

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Magenta
Write-Host "1. Set your OpenAI API key:" -ForegroundColor White
Write-Host "   - Option A: Set environment variable OPENAI_API_KEY" -ForegroundColor Gray
Write-Host "   - Option B: Update the API key in Program.cs line ~60" -ForegroundColor Gray
Write-Host "   - Option C: Add to appsettings.json" -ForegroundColor Gray

Write-Host "`n2. Test the integration:" -ForegroundColor White
Write-Host "   - Run: .\openai-test.ps1" -ForegroundColor Gray
Write-Host "   - Or run: .\comprehensive-backend-test.ps1" -ForegroundColor Gray

Write-Host "`n3. Monitor API usage:" -ForegroundColor White
Write-Host "   - Check OpenAI dashboard for usage" -ForegroundColor Gray
Write-Host "   - Monitor costs and rate limits" -ForegroundColor Gray

Write-Host "`n=== IMPORTANT NOTES ===" -ForegroundColor Magenta
Write-Host "• The current implementation uses GPT-3.5-turbo" -ForegroundColor Yellow
Write-Host "• Consider upgrading to GPT-4 for better quality" -ForegroundColor Yellow
Write-Host "• Implement rate limiting to control costs" -ForegroundColor Yellow
Write-Host "• Add error handling for API failures" -ForegroundColor Yellow

Write-Host "`n=== API KEY SETUP ===" -ForegroundColor Magenta
Write-Host "To set your OpenAI API key, choose one of these methods:" -ForegroundColor White

Write-Host "`nMethod 1 - Environment Variable (Recommended):" -ForegroundColor Cyan
Write-Host '$env:OPENAI_API_KEY = "your-api-key-here"' -ForegroundColor Gray

Write-Host "`nMethod 2 - Update Program.cs:" -ForegroundColor Cyan
Write-Host "Replace the API key on line ~60 in Program.cs" -ForegroundColor Gray

Write-Host "`nMethod 3 - appsettings.json:" -ForegroundColor Cyan
Write-Host "Add to backend/appsettings.json:" -ForegroundColor Gray
Write-Host '"OpenAI": { "ApiKey": "your-api-key-here" }' -ForegroundColor Gray

Write-Host "`nOpenAI Integration Enabled Successfully!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green 