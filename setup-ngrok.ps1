Write-Host "=== SETTING UP NGROK FOR PUBLIC WEBHOOK ACCESS ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Install ngrok (if not already installed)" -ForegroundColor Yellow
Write-Host "Download from: https://ngrok.com/download" -ForegroundColor White
Write-Host "Or install via chocolatey: choco install ngrok" -ForegroundColor White
Write-Host ""

Write-Host "Step 2: Start ngrok tunnel" -ForegroundColor Yellow
Write-Host "Run this command in a new terminal:" -ForegroundColor White
Write-Host "ngrok http 5026" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Get your public URL" -ForegroundColor Yellow
Write-Host "After running ngrok, you'll see something like:" -ForegroundColor White
Write-Host "Forwarding    https://abc123.ngrok.io -> http://localhost:5026" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 4: Use the public URL in Gumroad" -ForegroundColor Yellow
Write-Host "Instead of: http://localhost:5026/webhooks/gumroad" -ForegroundColor White
Write-Host "Use: https://abc123.ngrok.io/webhooks/gumroad" -ForegroundColor Green
Write-Host ""

Write-Host "Step 5: Test the public webhook" -ForegroundColor Yellow
Write-Host "Test with: curl -X POST https://abc123.ngrok.io/webhooks/gumroad" -ForegroundColor Green
Write-Host ""

Write-Host "=== ALTERNATIVE OPTIONS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 2: Deploy to production first" -ForegroundColor Yellow
Write-Host "- Deploy backend to Azure/Render" -ForegroundColor White
Write-Host "- Use production URL for webhooks" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Use webhook.site (for testing)" -ForegroundColor Yellow
Write-Host "- Go to https://webhook.site" -ForegroundColor White
Write-Host "- Get a temporary webhook URL" -ForegroundColor White
Write-Host "- Forward to your local backend" -ForegroundColor White
Write-Host ""

Write-Host "=== RECOMMENDED APPROACH ===" -ForegroundColor Cyan
Write-Host "1. Use ngrok for development testing" -ForegroundColor Green
Write-Host "2. Deploy to production for real use" -ForegroundColor Green
Write-Host "3. Update webhook URLs to production URLs" -ForegroundColor Green 