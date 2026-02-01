# Frontend Debug Script
Write-Host "Frontend Debug Diagnostics" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

$baseUrl = "http://localhost:5026"
$frontendUrl = "http://localhost:5173"

# Test 1: Backend Health
Write-Host "`n1. Testing Backend Health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Backend is running: $healthResponse" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please start the backend first: cd backend; dotnet run --project backend.csproj" -ForegroundColor Yellow
    exit 1
}

# Test 2: Frontend Accessibility
Write-Host "`n2. Testing Frontend Accessibility..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri $frontendUrl -UseBasicParsing
    Write-Host "✅ Frontend is accessible: Status $($frontendResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is not accessible: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Please start the frontend: cd frontend; npm run dev" -ForegroundColor Yellow
}

# Test 3: CORS Configuration
Write-Host "`n3. Testing CORS Configuration..." -ForegroundColor Cyan
try {
    $corsHeaders = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing -Headers @{"Origin" = "http://localhost:5173"}
    Write-Host "✅ CORS headers present: $($corsHeaders.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Green
} catch {
    Write-Host "⚠️  CORS test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 4: Authentication Flow
Write-Host "`n4. Testing Authentication Flow..." -ForegroundColor Cyan
$testEmail = "debug$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$testPassword = "TestPassword123!"

# Register
try {
    $registerData = @{
        email = $testEmail
        password = $testPassword
        firstName = "Debug"
        lastName = "User"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    Write-Host "✅ Registration successful" -ForegroundColor Green
    $authToken = $registerResponse.token
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Error details: $errorBody" -ForegroundColor Red
    }
    exit 1
}

# Test auth validation
try {
    $headers = @{
        "Authorization" = "Bearer $authToken"
        "Content-Type" = "application/json"
    }
    $validateResponse = Invoke-RestMethod -Uri "$baseUrl/auth/validate" -Method GET -Headers $headers
    Write-Host "✅ Token validation successful: $($validateResponse.valid)" -ForegroundColor Green
} catch {
    Write-Host "❌ Token validation failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Cover Letter Generation
Write-Host "`n5. Testing Cover Letter Generation..." -ForegroundColor Cyan
try {
    $generateData = @{
        jobTitle = "Software Engineer"
        companyName = "Test Company"
        userInfo = "Experienced developer with 5 years of experience in web development."
        tone = "professional"
        experienceLevel = "mid-level"
        language = "en"
    } | ConvertTo-Json

    $generateResponse = Invoke-RestMethod -Uri "$baseUrl/generate" -Method POST -Body $generateData -Headers $headers
    Write-Host "✅ Cover letter generation successful" -ForegroundColor Green
    Write-Host "   Generated: $($generateResponse.coverLetter.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "   Usage: $($generateResponse.monthlyUsage)/$($generateResponse.limit)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Cover letter generation failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Error details: $errorBody" -ForegroundColor Red
    }
}

# Test 6: Analytics
Write-Host "`n6. Testing Analytics..." -ForegroundColor Cyan
try {
    $analyticsResponse = Invoke-RestMethod -Uri "$baseUrl/analytics" -Method GET -Headers $headers
    Write-Host "✅ Analytics successful" -ForegroundColor Green
    Write-Host "   Total letters: $($analyticsResponse.totalLetters)" -ForegroundColor Gray
    Write-Host "   This month: $($analyticsResponse.lettersThisMonth)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Analytics failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Languages
Write-Host "`n7. Testing Languages..." -ForegroundColor Cyan
try {
    $languagesResponse = Invoke-RestMethod -Uri "$baseUrl/languages" -Method GET
    Write-Host "✅ Languages endpoint successful" -ForegroundColor Green
    Write-Host "   Available languages: $($languagesResponse.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Languages failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Debug Summary ===" -ForegroundColor Magenta
Write-Host "If all tests passed, the backend is working correctly." -ForegroundColor Green
Write-Host "If frontend still has issues, check:" -ForegroundColor Yellow
Write-Host "1. Browser console for JavaScript errors" -ForegroundColor Yellow
Write-Host "2. Network tab for failed API calls" -ForegroundColor Yellow
Write-Host "3. CORS issues in browser" -ForegroundColor Yellow
Write-Host "4. Frontend environment variables" -ForegroundColor Yellow 