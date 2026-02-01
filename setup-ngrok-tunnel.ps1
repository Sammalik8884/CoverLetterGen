Write-Host "=== SETUP NGROK TUNNEL FOR WEBHOOK ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Gumroad cannot reach localhost URLs. We need to create a public tunnel." -ForegroundColor Yellow
Write-Host ""

Write-Host "=== STEP 1: INSTALL NGROK ===" -ForegroundColor Yellow
Write-Host "1. Download ngrok from: https://ngrok.com/download" -ForegroundColor White
Write-Host "2. Extract ngrok.exe to your project folder" -ForegroundColor White
Write-Host "3. Sign up for free ngrok account" -ForegroundColor White
Write-Host "4. Get your authtoken from ngrok dashboard" -ForegroundColor White
Write-Host ""

Write-Host "=== STEP 2: CONFIGURE NGROK ===" -ForegroundColor Yellow
Write-Host "Run these commands:" -ForegroundColor White
Write-Host "1. ngrok config add-authtoken YOUR_TOKEN_HERE" -ForegroundColor Cyan
Write-Host "2. ngrok http 5026" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== STEP 3: GET PUBLIC URL ===" -ForegroundColor Yellow
Write-Host "After running ngrok, you'll get a public URL like:" -ForegroundColor White
Write-Host "   https://abc123.ngrok.io" -ForegroundColor Green
Write-Host ""

Write-Host "=== STEP 4: CONFIGURE GUMROAD ===" -ForegroundColor Yellow
Write-Host "Use this webhook URL in Gumroad:" -ForegroundColor White
Write-Host "   https://abc123.ngrok.io/webhooks/gumroad" -ForegroundColor Green
Write-Host ""

Write-Host "=== ALTERNATIVE: USE WEBHOOK.SITE ===" -ForegroundColor Yellow
Write-Host "For testing, you can also use your webhook.site URL:" -ForegroundColor White
Write-Host "   https://webhook.site/62865035-64f9-48ad-902f-7530f527a7f7" -ForegroundColor Green
Write-Host ""

Write-Host "Ready to set up ngrok tunnel!" -ForegroundColor Green 