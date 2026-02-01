Write-Host "Testing CoverLetterGen Authentication..." -ForegroundColor Green

# Test backend connectivity
Write-Host "Testing backend connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/health" -Method GET
    Write-Host "Backend is running. Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Backend is not running. Please start the backend first." -ForegroundColor Red
    exit 1
}

# Test login
Write-Host "Testing user login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "testpassword123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login successful" -ForegroundColor Green
    $loginData = $response.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "Token received: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test token validation
Write-Host "Testing token validation..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/auth/validate" -Method GET -Headers $headers
    Write-Host "Token validation successful" -ForegroundColor Green
} catch {
    Write-Host "Token validation failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Authentication tests completed!" -ForegroundColor Green 