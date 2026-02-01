Write-Host "=== UPDATE GUMROAD WEBHOOK TO LOCAL BACKEND ===" -ForegroundColor Cyan
Write-Host ""

# Your local backend webhook URL
$localWebhookUrl = "http://localhost:5026/webhooks/gumroad"
$webhookSiteUrl = "https://webhook.site/62865035-64f9-48ad-902f-7530f527a7f7"

Write-Host "Current webhook URL (webhook.site):" -ForegroundColor Yellow
Write-Host "   $webhookSiteUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "New webhook URL (local backend):" -ForegroundColor Green
Write-Host "   $localWebhookUrl" -ForegroundColor Green
Write-Host ""

Write-Host "=== GUMROAD CONFIGURATION UPDATE STEPS ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to Gumroad Dashboard: https://gumroad.com/dashboard" -ForegroundColor White
Write-Host "2. Select your Monthly Product" -ForegroundColor White
Write-Host "3. Go to Settings → Webhooks" -ForegroundColor White
Write-Host "4. Update webhook URL to: $localWebhookUrl" -ForegroundColor Green
Write-Host "5. Repeat for your Annual Product" -ForegroundColor White
Write-Host ""

Write-Host "=== TEST YOUR BACKEND FIRST ===" -ForegroundColor Yellow
Write-Host "Before updating Gumroad, test your local backend:" -ForegroundColor White
Write-Host "1. Start your backend: cd backend && dotnet run" -ForegroundColor Cyan
Write-Host "2. Test webhook endpoint: powershell -ExecutionPolicy Bypass -File quick-webhook-test.ps1" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== EXPECTED RESULT ===" -ForegroundColor Yellow
Write-Host "After updating Gumroad webhooks:" -ForegroundColor White
Write-Host "1. Make a test purchase" -ForegroundColor White
Write-Host "2. Check your backend console for webhook logs" -ForegroundColor White
Write-Host "3. User should be upgraded to Pro automatically" -ForegroundColor White
Write-Host ""

Write-Host "=== BACKEND WEBHOOK LOGS ===" -ForegroundColor Yellow
Write-Host "You should see in your backend console:" -ForegroundColor White
Write-Host "=== GUMROAD WEBHOOK RECEIVED ===" -ForegroundColor Gray
Write-Host "Processing payment for email: [customer email]" -ForegroundColor Gray
Write-Host "Product ID: x7hBGQuJMdM2Fbii7bSIcA==" -ForegroundColor Gray
Write-Host "Payment processed successfully" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to update Gumroad webhooks!" -ForegroundColor Green 