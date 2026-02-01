Write-Host "=== GUMROAD WEBHOOK SETUP ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Create Gumroad Application" -ForegroundColor Yellow
Write-Host "1. Go to: https://gumroad.com/advanced_settings" -ForegroundColor White
Write-Host "2. Click 'Create application'" -ForegroundColor White
Write-Host "3. Fill in:" -ForegroundColor White
Write-Host "   - Application icon: Upload a small image" -ForegroundColor Gray
Write-Host "   - Application name: CoverLetterGen" -ForegroundColor Gray
Write-Host "   - Redirect URI: http://127.0.0.1" -ForegroundColor Gray
Write-Host "4. Click 'Create application'" -ForegroundColor White
Write-Host "5. Click 'Generate access token'" -ForegroundColor White
Write-Host "6. Copy your access token" -ForegroundColor White
Write-Host ""

Write-Host "Step 2: Configure Webhooks" -ForegroundColor Yellow
Write-Host "You need to configure webhooks for both products:" -ForegroundColor White
Write-Host ""
Write-Host "Monthly Product (x7hBGQuJMdM2Fbii7bSIcA==):" -ForegroundColor Green
Write-Host "  - Go to product settings" -ForegroundColor Gray
Write-Host "  - Webhook URL: http://localhost:5026/webhooks/gumroad" -ForegroundColor Gray
Write-Host "  - Webhook Secret: isJ/gpck1kWPm+IF2eDWpMN8JDOW6FsY9DSbtyAwYiA=" -ForegroundColor Gray
Write-Host ""
Write-Host "Annual Product (Xd0MolbZ2G8y2csGdN5wwA==):" -ForegroundColor Green
Write-Host "  - Go to product settings" -ForegroundColor Gray
Write-Host "  - Webhook URL: http://localhost:5026/webhooks/gumroad" -ForegroundColor Gray
Write-Host "  - Webhook Secret: isJ/gpck1kWPm+IF2eDWpMN8JDOW6FsY9DSbtyAwYiA=" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 3: Test Webhook Configuration" -ForegroundColor Yellow
Write-Host "After setting up, test with this curl command:" -ForegroundColor White
Write-Host ""
Write-Host "curl -X POST http://localhost:5026/webhooks/gumroad \" -ForegroundColor Gray
Write-Host "  -H \"Content-Type: application/x-www-form-urlencoded\" \" -ForegroundColor Gray
Write-Host "  -d \"product_id=x7hBGQuJMdM2Fbii7bSIcA==&email=test@example.com&test=true\"" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 4: Verify Backend Logs" -ForegroundColor Yellow
Write-Host "Check your backend console for webhook messages:" -ForegroundColor White
Write-Host "=== GUMROAD WEBHOOK RECEIVED ===" -ForegroundColor Gray
Write-Host "Processing payment for email: test@example.com" -ForegroundColor Gray
Write-Host "Payment processed successfully" -ForegroundColor Gray
Write-Host ""

Write-Host "=== IMPORTANT NOTES ===" -ForegroundColor Cyan
Write-Host "1. Keep your access token secure" -ForegroundColor Yellow
Write-Host "2. Webhook URL must be publicly accessible for production" -ForegroundColor Yellow
Write-Host "3. Test webhooks in development first" -ForegroundColor Yellow
Write-Host "4. Update URLs to production URLs when deploying" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your payment functionality will work once webhooks are configured!" -ForegroundColor Green 