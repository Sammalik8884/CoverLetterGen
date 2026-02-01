Write-Host "=== GUMROAD API CONFIGURATION ===" -ForegroundColor Cyan
Write-Host ""

# Get access token from user
$accessToken = Read-Host "Enter your Gumroad access token"

if ([string]::IsNullOrEmpty($accessToken)) {
    Write-Host "Access token is required. Please get it from Gumroad advanced settings." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Testing API connection..." -ForegroundColor Yellow

# Test API connection
try {
    $headers = @{
        "Content-Type" = "application/x-www-form-urlencoded"
    }
    
    $body = "access_token=$accessToken"
    
    $response = Invoke-RestMethod -Uri "https://api.gumroad.com/v2/products" -Method GET -Headers $headers -Body $body
    
    Write-Host "✅ API connection successful!" -ForegroundColor Green
    Write-Host "Found $($response.products.Count) products" -ForegroundColor Gray
    
    # Display products
    Write-Host ""
    Write-Host "Your Products:" -ForegroundColor Yellow
    foreach ($product in $response.products) {
        Write-Host "  - $($product.name) (ID: $($product.id))" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ API connection failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your access token and try again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "=== WEBHOOK CONFIGURATION ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To configure webhooks, you need to:" -ForegroundColor Yellow
Write-Host "1. Go to each product in your Gumroad dashboard" -ForegroundColor White
Write-Host "2. Go to Settings → Webhooks" -ForegroundColor White
Write-Host "3. Add webhook URL: http://localhost:5026/webhooks/gumroad" -ForegroundColor White
Write-Host "4. Add webhook secret: isJ/gpck1kWPm+IF2eDWpMN8JDOW6FsY9DSbtyAwYiA=" -ForegroundColor White
Write-Host ""

Write-Host "=== TESTING WEBHOOK ===" -ForegroundColor Cyan
Write-Host "After configuring webhooks, test with:" -ForegroundColor Yellow

$testCommand = @"
curl -X POST http://localhost:5026/webhooks/gumroad \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "product_id=x7hBGQuJMdM2Fbii7bSIcA==&email=test@example.com&test=true"
"@

Write-Host $testCommand -ForegroundColor Gray

Write-Host ""
Write-Host "=== EXPECTED BACKEND LOGS ===" -ForegroundColor Cyan
Write-Host "You should see in your backend console:" -ForegroundColor Yellow
Write-Host "=== GUMROAD WEBHOOK RECEIVED ===" -ForegroundColor Gray
Write-Host "Processing payment for email: test@example.com" -ForegroundColor Gray
Write-Host "Product ID: x7hBGQuJMdM2Fbii7bSIcA==" -ForegroundColor Gray
Write-Host "Payment processed successfully" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Once webhooks are configured, your payment functionality will work!" -ForegroundColor Green 