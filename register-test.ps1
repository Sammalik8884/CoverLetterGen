Write-Host "Testing user registration..." -ForegroundColor Green

$registerBody = @{
    email = "test@example.com"
    password = "testpassword123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "Registration successful" -ForegroundColor Green
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "Token received: $($registerData.token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 400) {
        $errorContent = $_.Exception.Response.Content
        Write-Host "Error details: $errorContent" -ForegroundColor Red
    }
} 