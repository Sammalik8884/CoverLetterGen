# CoverLetterGen - JWT Secret Setup Script
# This script generates a secure JWT secret and sets it up for the application

Write-Host "🔐 CoverLetterGen - JWT Secret Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Generate a secure JWT secret (64 bytes for better security)
Write-Host "Generating secure JWT secret..." -ForegroundColor Yellow
$bytes = New-Object Byte[] 64
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
$jwtSecret = [Convert]::ToBase64String($bytes)

Write-Host "Generated JWT Secret: $jwtSecret" -ForegroundColor Cyan

# Set environment variable for current session
Write-Host "Setting JWT_SECRET environment variable..." -ForegroundColor Yellow
$env:JWT_SECRET = $jwtSecret

# Update appsettings.json with the new secret
Write-Host "Updating appsettings.json..." -ForegroundColor Yellow
$appSettingsPath = "backend/appsettings.json"
if (Test-Path $appSettingsPath) {
    $appSettings = Get-Content $appSettingsPath | ConvertFrom-Json
    
    # Update JWT secret
    $appSettings.Jwt.Secret = $jwtSecret
    
    # Save back to file
    $appSettings | ConvertTo-Json -Depth 10 | Set-Content $appSettingsPath
    Write-Host "✅ Updated $appSettingsPath" -ForegroundColor Green
} else {
    Write-Host "❌ Could not find $appSettingsPath" -ForegroundColor Red
}

# Update appsettings.Development.json
Write-Host "Updating appsettings.Development.json..." -ForegroundColor Yellow
$devAppSettingsPath = "backend/appsettings.Development.json"
if (Test-Path $devAppSettingsPath) {
    $devAppSettings = Get-Content $devAppSettingsPath | ConvertFrom-Json
    
    # Add JWT configuration if it doesn't exist
    if (-not $devAppSettings.Jwt) {
        $devAppSettings | Add-Member -MemberType NoteProperty -Name "Jwt" -Value @{
            Secret = $jwtSecret
            Issuer = "CoverLetterGen"
            Audience = "CoverLetterGenUsers"
            ExpiryInDays = 7
        }
    } else {
        $devAppSettings.Jwt.Secret = $jwtSecret
    }
    
    # Save back to file
    $devAppSettings | ConvertTo-Json -Depth 10 | Set-Content $devAppSettingsPath
    Write-Host "✅ Updated $devAppSettingsPath" -ForegroundColor Green
} else {
    Write-Host "❌ Could not find $devAppSettingsPath" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 JWT Secret Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • Generated secure JWT secret: $jwtSecret" -ForegroundColor White
Write-Host "   • Set JWT_SECRET environment variable" -ForegroundColor White
Write-Host "   • Updated appsettings.json" -ForegroundColor White
Write-Host "   • Updated appsettings.Development.json" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important Notes:" -ForegroundColor Yellow
Write-Host "   • Keep this secret secure and never commit it to version control" -ForegroundColor White
Write-Host "   • For production, use environment variables instead of config files" -ForegroundColor White
Write-Host "   • The environment variable will be used if set, otherwise config file value" -ForegroundColor White
Write-Host ""
Write-Host "🚀 You can now run the backend with: dotnet run" -ForegroundColor Green 