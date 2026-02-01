# Simple Backend API Test Script
# Tests all endpoints including authentication and OpenAI functionality

param(
    [string]$BaseUrl = "http://localhost:5026",
    [string]$TestEmail = "test@example.com",
    [string]$TestPassword = "testpass123"
)

Write-Host "Starting Backend API Tests..." -ForegroundColor Green
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan

# Global variables
$GlobalToken = ""
$GlobalRefreshToken = ""

# Test 1: Health Check
Write-Host "`n=== 1. Health Check Endpoints ===" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET
    Write-Host "✓ Health Check: OK" -ForegroundColor Green
} catch {
    Write-Host "✗ Health Check: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Authentication
Write-Host "`n=== 2. Authentication Endpoints ===" -ForegroundColor Yellow

# Register
Write-Host "Testing user registration..." -ForegroundColor Cyan
try {
    $registerBody = @{
        email = $TestEmail
        password = $TestPassword
        firstName = "Test"
        lastName = "User"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✓ Registration: Successful" -ForegroundColor Green
    $GlobalToken = $response.token
    $GlobalRefreshToken = $response.refreshToken
} catch {
    Write-Host "⚠ Registration failed, trying login..." -ForegroundColor Yellow
    
    # Try login
    try {
        $loginBody = @{
            email = $TestEmail
            password = $TestPassword
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
        Write-Host "✓ Login: Successful" -ForegroundColor Green
        $GlobalToken = $response.token
        $GlobalRefreshToken = $response.refreshToken
    } catch {
        Write-Host "✗ Login: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Cover Letter Generation (OpenAI)
Write-Host "`n=== 3. Cover Letter Generation (OpenAI) ===" -ForegroundColor Yellow

if ($GlobalToken) {
    Write-Host "Testing cover letter generation..." -ForegroundColor Cyan
    
    try {
        $generateBody = @{
            jobTitle = "Software Engineer"
            companyName = "Tech Corp"
            userInfo = "I am a passionate developer with 3 years of experience in React, Node.js, and cloud technologies. I have successfully delivered multiple web applications and am excited about the opportunity to contribute to your team."
            tone = "professional"
            experienceLevel = "mid-level"
            language = "en"
        } | ConvertTo-Json

        $headers = @{
            "Authorization" = "Bearer $GlobalToken"
            "Content-Type" = "application/json"
        }

        $response = Invoke-RestMethod -Uri "$BaseUrl/generate" -Method POST -Body $generateBody -Headers $headers
        Write-Host "✓ Cover Letter Generation: Successful" -ForegroundColor Green
        Write-Host "  Monthly usage: $($response.monthlyUsage)/$($response.limit)" -ForegroundColor Cyan
        Write-Host "  Tokens used: $($response.tokensUsed)" -ForegroundColor Cyan
        Write-Host "  Content preview: $($response.coverLetter.Substring(0, [Math]::Min(100, $response.coverLetter.Length)))..." -ForegroundColor Gray
    } catch {
        Write-Host "✗ Cover Letter Generation: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test multilingual generation
    Write-Host "Testing German cover letter generation..." -ForegroundColor Cyan
    try {
        $germanBody = @{
            jobTitle = "Entwickler"
            companyName = "Tech GmbH"
            userInfo = "Ich bin ein leidenschaftlicher Entwickler mit 3 Jahren Erfahrung in React, Node.js und Cloud-Technologien."
            tone = "professional"
            experienceLevel = "mid-level"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$BaseUrl/generate/de" -Method POST -Body $germanBody -Headers $headers
        Write-Host "✓ German Cover Letter: Successful" -ForegroundColor Green
    } catch {
        Write-Host "✗ German Cover Letter: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠ Skipping generation tests - no authentication token" -ForegroundColor Yellow
}

# Test 4: Cover Letter Management
Write-Host "`n=== 4. Cover Letter Management ===" -ForegroundColor Yellow

if ($GlobalToken) {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/coverletters" -Method GET -Headers $headers
        Write-Host "✓ Get Cover Letters: Successful ($($response.Count) letters)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Get Cover Letters: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Analytics
Write-Host "`n=== 5. Analytics ===" -ForegroundColor Yellow

if ($GlobalToken) {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/analytics" -Method GET -Headers $headers
        Write-Host "✓ Analytics: Successful" -ForegroundColor Green
        Write-Host "  Monthly usage: $($response.monthlyUsage)/$($response.limit)" -ForegroundColor Cyan
        Write-Host "  Total letters: $($response.totalLetters)" -ForegroundColor Cyan
        Write-Host "  Is Pro: $($response.isPro)" -ForegroundColor Cyan
    } catch {
        Write-Host "✗ Analytics: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 6: Languages
Write-Host "`n=== 6. Languages ===" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/languages" -Method GET
    Write-Host "✓ Languages: Successful ($($response.Count) languages)" -ForegroundColor Green
    foreach ($lang in $response) {
        Write-Host "  $($lang.flag) $($lang.name) ($($lang.code))" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Languages: Failed - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Error Handling
Write-Host "`n=== 7. Error Handling ===" -ForegroundColor Yellow

# Test invalid authentication
try {
    $invalidHeaders = @{
        "Authorization" = "Bearer invalid_token"
        "Content-Type" = "application/json"
    }
    Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method GET -Headers $invalidHeaders
    Write-Host "✗ Invalid Token: Should have failed" -ForegroundColor Red
} catch {
    Write-Host "✓ Invalid Token: Correctly rejected" -ForegroundColor Green
}

# Test missing required fields
try {
    $invalidBody = @{
        jobTitle = ""
        companyName = ""
        userInfo = ""
    } | ConvertTo-Json

    if ($GlobalToken) {
        Invoke-RestMethod -Uri "$BaseUrl/generate" -Method POST -Body $invalidBody -Headers $headers
        Write-Host "✗ Missing Fields: Should have failed" -ForegroundColor Red
    } else {
        Write-Host "⚠ Missing Fields: Skipped (no auth)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✓ Missing Fields: Correctly rejected" -ForegroundColor Green
}

# Test 8: Rate Limiting
Write-Host "`n=== 8. Rate Limiting ===" -ForegroundColor Yellow

if ($GlobalToken) {
    Write-Host "Testing rate limiting..." -ForegroundColor Cyan
    
    for ($i = 1; $i -le 5; $i++) {
        try {
            $limitBody = @{
                jobTitle = "Test Job $i"
                companyName = "Test Company $i"
                userInfo = "This is test number $i for rate limiting."
                tone = "professional"
                experienceLevel = "entry-level"
            } | ConvertTo-Json

            $response = Invoke-RestMethod -Uri "$BaseUrl/generate" -Method POST -Body $limitBody -Headers $headers
            Write-Host "  Test $i - Monthly usage: $($response.monthlyUsage)/$($response.limit)" -ForegroundColor Cyan
            
            if ($response.monthlyUsage -ge $response.limit) {
                Write-Host "  Rate limit reached after $i attempts" -ForegroundColor Yellow
                break
            }
        } catch {
            Write-Host "  Test $i - Failed: $($_.Exception.Message)" -ForegroundColor Red
            break
        }
    }
}

# Test 9: OpenAI Integration Quality
Write-Host "`n=== 9. OpenAI Integration Quality ===" -ForegroundColor Yellow

if ($GlobalToken) {
    # Test different tones
    $tones = @("professional", "friendly", "creative", "formal")
    
    foreach ($tone in $tones) {
        try {
            $toneBody = @{
                jobTitle = "Test Position"
                companyName = "Test Company"
                userInfo = "I am a test candidate with experience in various technologies."
                tone = $tone
                experienceLevel = "mid-level"
            } | ConvertTo-Json

            $response = Invoke-RestMethod -Uri "$BaseUrl/generate" -Method POST -Body $toneBody -Headers $headers
            Write-Host "✓ $tone tone: Generated successfully" -ForegroundColor Green
        } catch {
            Write-Host "✗ $tone tone: Failed - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Final Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Green
Write-Host "Base URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "Test User: $TestEmail" -ForegroundColor Cyan
if ($GlobalToken) {
    Write-Host "Authentication: Successful" -ForegroundColor Green
    Write-Host "Token: $($GlobalToken.Substring(0, [Math]::Min(20, $GlobalToken.Length)))..." -ForegroundColor Gray
} else {
    Write-Host "Authentication: Failed" -ForegroundColor Red
}

Write-Host "`nTesting Complete!" -ForegroundColor Green 