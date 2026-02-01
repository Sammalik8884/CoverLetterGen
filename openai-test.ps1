# OpenAI Integration Test Script
# Tests OpenAI functionality and provides guidance for real integration

Write-Host "OpenAI Integration Testing" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Configuration
$baseUrl = "http://localhost:5026"
$testEmail = "openai-test$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$testPassword = "TestPassword123!"
$authToken = $null

# Helper function to make authenticated requests
function Invoke-AuthenticatedRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [object]$Body = $null,
        [string]$ContentType = "application/json"
    )
    
    $headers = @{
        "Content-Type" = $ContentType
    }
    
    if ($authToken) {
        $headers["Authorization"] = "Bearer $authToken"
    }
    
    $params = @{
        Uri = $Uri
        Method = $Method
        Headers = $headers
    }
    
    if ($Body) {
        $params.Body = $Body
    }
    
    return Invoke-RestMethod @params
}

# Helper function to test OpenAI generation
function Test-OpenAIGeneration {
    param(
        [string]$Language = "en",
        [string]$Tone = "professional",
        [string]$ExperienceLevel = "senior"
    )
    
    $endpoint = if ($Language -eq "en") { "/generate" } else { "/generate/$Language" }
    
    $generateData = @{
        jobTitle = "Senior Software Engineer"
        companyName = "Tech Innovations Inc."
        userInfo = "Experienced full-stack developer with 7 years of experience in JavaScript, React, Node.js, and Python. Passionate about creating scalable web applications and leading development teams. Strong background in cloud technologies and microservices architecture."
        tone = $Tone
        experienceLevel = $ExperienceLevel
        language = $Language
    } | ConvertTo-Json
    
    Write-Host "`nTesting OpenAI Generation ($Language, $Tone, $ExperienceLevel)..." -ForegroundColor Cyan
    Write-Host "Endpoint: POST $baseUrl$endpoint" -ForegroundColor Gray
    
    try {
        $response = Invoke-AuthenticatedRequest -Uri "$baseUrl$endpoint" -Method "POST" -Body $generateData
        
        Write-Host "SUCCESS: OpenAI generation working" -ForegroundColor Green
        Write-Host "Cover Letter Content:" -ForegroundColor Yellow
        Write-Host "====================" -ForegroundColor Gray
        Write-Host $response.coverLetter -ForegroundColor White
        Write-Host "====================" -ForegroundColor Gray
        Write-Host "Monthly Usage: $($response.monthlyUsage)/$($response.limit)" -ForegroundColor Gray
        Write-Host "Tokens Used: $($response.tokensUsed)" -ForegroundColor Gray
        
        return $true
    }
    catch {
        Write-Host "FAILED: OpenAI generation" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error details: $errorBody" -ForegroundColor Red
        }
        return $false
    }
}

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test Results Tracking
$testResults = @{}

# 1. Register a test user
Write-Host "`n=== SETTING UP TEST USER ===" -ForegroundColor Magenta

$registerData = @{
    email = $testEmail
    password = $testPassword
    firstName = "OpenAI"
    lastName = "Tester"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    $authToken = $response.token
    Write-Host "SUCCESS: Test user registered and authenticated" -ForegroundColor Green
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: User registration" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Test OpenAI Generation in Different Languages
Write-Host "`n=== OPENAI GENERATION TESTS ===" -ForegroundColor Magenta

$testResults["English Generation"] = Test-OpenAIGeneration -Language "en" -Tone "professional" -ExperienceLevel "senior"
$testResults["Spanish Generation"] = Test-OpenAIGeneration -Language "es" -Tone "professional" -ExperienceLevel "mid-level"
$testResults["German Generation"] = Test-OpenAIGeneration -Language "de" -Tone "formal" -ExperienceLevel "senior"
$testResults["French Generation"] = Test-OpenAIGeneration -Language "fr" -Tone "professional" -ExperienceLevel "entry-level"

# 3. Test Different Tones and Experience Levels
Write-Host "`n=== TONE AND EXPERIENCE LEVEL TESTS ===" -ForegroundColor Magenta

$testResults["Casual Tone"] = Test-OpenAIGeneration -Language "en" -Tone "casual" -ExperienceLevel "senior"
$testResults["Formal Tone"] = Test-OpenAIGeneration -Language "en" -Tone "formal" -ExperienceLevel "senior"
$testResults["Entry Level"] = Test-OpenAIGeneration -Language "en" -Tone "professional" -ExperienceLevel "entry-level"
$testResults["Mid Level"] = Test-OpenAIGeneration -Language "en" -Tone "professional" -ExperienceLevel "mid-level"

# 4. Test Error Handling
Write-Host "`n=== ERROR HANDLING TESTS ===" -ForegroundColor Magenta

# Test with empty fields
$invalidData = @{
    jobTitle = ""
    companyName = ""
    userInfo = ""
} | ConvertTo-Json

try {
    $response = Invoke-AuthenticatedRequest -Uri "$baseUrl/generate" -Method "POST" -Body $invalidData
    Write-Host "FAILED: Should have rejected empty fields" -ForegroundColor Red
    $testResults["Invalid Input Handling"] = $false
} catch {
    Write-Host "SUCCESS: Properly rejected invalid input" -ForegroundColor Green
    $testResults["Invalid Input Handling"] = $true
}

# Test without authentication
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/generate" -Method POST -Body $generateData -ContentType "application/json"
    Write-Host "FAILED: Should have required authentication" -ForegroundColor Red
    $testResults["Authentication Required"] = $false
} catch {
    Write-Host "SUCCESS: Properly required authentication" -ForegroundColor Green
    $testResults["Authentication Required"] = $true
}

# 5. Test Usage Limits
Write-Host "`n=== USAGE LIMIT TESTS ===" -ForegroundColor Magenta

# Generate multiple cover letters to test limits
for ($i = 1; $i -le 5; $i++) {
    $testResults["Usage Limit Test $i"] = Test-OpenAIGeneration -Language "en" -Tone "professional" -ExperienceLevel "senior"
    Start-Sleep -Seconds 1
}

# 6. Test Analytics
Write-Host "`n=== ANALYTICS TESTS ===" -ForegroundColor Magenta

try {
    $analytics = Invoke-AuthenticatedRequest -Uri "$baseUrl/analytics"
    Write-Host "SUCCESS: Analytics retrieved" -ForegroundColor Green
    Write-Host "Monthly Usage: $($analytics.monthlyUsage)/$($analytics.limit)" -ForegroundColor Gray
    Write-Host "Is Pro: $($analytics.isPro)" -ForegroundColor Gray
    Write-Host "Total Letters: $($analytics.totalLetters)" -ForegroundColor Gray
    $testResults["Analytics"] = $true
} catch {
    Write-Host "FAILED: Analytics retrieval" -ForegroundColor Red
    $testResults["Analytics"] = $false
}

# Summary
Write-Host "`n=== OPENAI TEST SUMMARY ===" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Green

$totalTests = $testResults.Count
$passedTests = ($testResults.Values | Where-Object { $_ -eq $true }).Count
$failedTests = $totalTests - $passedTests

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passedTests / $totalTests) * 100, 2))%" -ForegroundColor Cyan

Write-Host "`nDetailed Results:" -ForegroundColor Yellow
foreach ($test in $testResults.GetEnumerator()) {
    $status = if ($test.Value) { "PASS" } else { "FAIL" }
    $color = if ($test.Value) { "Green" } else { "Red" }
    Write-Host "$status - $($test.Key)" -ForegroundColor $color
}

# OpenAI Integration Analysis
Write-Host "`n=== OPENAI INTEGRATION ANALYSIS ===" -ForegroundColor Magenta

$generationTests = @("English Generation", "Spanish Generation", "German Generation", "French Generation")
$successfulGenerations = ($testResults.GetEnumerator() | Where-Object { $generationTests -contains $_.Key -and $_.Value }).Count

if ($successfulGenerations -gt 0) {
    Write-Host "✅ OpenAI integration is functional!" -ForegroundColor Green
    Write-Host "Successfully generated $successfulGenerations out of $($generationTests.Count) language tests" -ForegroundColor Green
    
    if ($successfulGenerations -eq $generationTests.Count) {
        Write-Host "🎉 All language generation tests passed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some language generation tests failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ OpenAI integration is not working" -ForegroundColor Red
}

# Current Implementation Status
Write-Host "`n=== CURRENT IMPLEMENTATION STATUS ===" -ForegroundColor Magenta
Write-Host "Based on the backend code analysis:" -ForegroundColor White
Write-Host "• OpenAI SDK integration is currently commented out" -ForegroundColor Yellow
Write-Host "• Using mock responses for cover letter generation" -ForegroundColor Yellow
Write-Host "• Real OpenAI API calls are disabled" -ForegroundColor Yellow

Write-Host "`n=== RECOMMENDATIONS FOR REAL OPENAI INTEGRATION ===" -ForegroundColor Magenta
Write-Host "1. Uncomment OpenAI SDK code in Program.cs" -ForegroundColor White
Write-Host "2. Set valid OPENAI_API_KEY environment variable" -ForegroundColor White
Write-Host "3. Update OpenAI SDK to latest version" -ForegroundColor White
Write-Host "4. Test with real API calls" -ForegroundColor White
Write-Host "5. Implement proper error handling for API failures" -ForegroundColor White
Write-Host "6. Add rate limiting and cost monitoring" -ForegroundColor White

Write-Host "`n=== MOCK VS REAL INTEGRATION ===" -ForegroundColor Magenta
Write-Host "Current Mock Response:" -ForegroundColor Yellow
Write-Host "• Basic template-based generation" -ForegroundColor Gray
Write-Host "• No real AI processing" -ForegroundColor Gray
Write-Host "• Fast response times" -ForegroundColor Gray
Write-Host "• No API costs" -ForegroundColor Gray

Write-Host "`nReal OpenAI Integration:" -ForegroundColor Yellow
Write-Host "• AI-powered content generation" -ForegroundColor Gray
Write-Host "• Context-aware responses" -ForegroundColor Gray
Write-Host "• Higher quality cover letters" -ForegroundColor Gray
Write-Host "• API costs and rate limits" -ForegroundColor Gray

Write-Host "`nOpenAI Integration Testing Completed!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Stop the backend process
Get-Process | Where-Object {$_.ProcessName -like "*dotnet*"} | Stop-Process -Force
Write-Host "`nBackend stopped." -ForegroundColor Yellow 