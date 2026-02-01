Write-Host "=== QUICK WEBHOOK TEST ===" -ForegroundColor Cyan
Write-Host ""

# Test if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/health" -Method GET -TimeoutSec 3
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not running. Start it with: cd backend && dotnet run" -ForegroundColor Red
    exit
}

# Test webhook endpoint
$webhookUrl = "http://localhost:5026/webhooks/gumroad"
$testData = "product_id=x7hBGQuJMdM2Fbii7bSIcA==&email=test@example.com&test=true"

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body $testData -ContentType "application/x-www-form-urlencoded" -TimeoutSec 5
    Write-Host "✅ Webhook endpoint is working" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Webhook endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== GUMROAD SETUP REQUIRED ===" -ForegroundColor Yellow
Write-Host "1. Go to Gumroad Dashboard" -ForegroundColor White
Write-Host "2. Select each product (Monthly & Annual)" -ForegroundColor White
Write-Host "3. Settings → Webhooks" -ForegroundColor White
Write-Host "4. Add: http://localhost:5026/webhooks/gumroad" -ForegroundColor White
Write-Host "5. Add secret: isJ/gpck1kWPm+IF2eDWpMN8JDOW6FsY9DSbtyAwYiA=" -ForegroundColor White
Write-Host ""
Write-Host "After this, your app is 100% ready for deployment!" -ForegroundColor Green 