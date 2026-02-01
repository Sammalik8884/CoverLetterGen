# Master Test Script
# Runs all backend tests in sequence

Write-Host "Master Test Suite - CoverLetterGen Backend" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Configuration
$testScripts = @(
    @{ Name = "Comprehensive Backend Test"; Script = "comprehensive-backend-test.ps1" },
    @{ Name = "OpenAI Integration Test"; Script = "openai-test.ps1" }
)

$results = @{}

# Function to run a test script
function Run-TestScript {
    param(
        [string]$Name,
        [string]$Script
    )
    
    Write-Host "`n=== RUNNING: $Name ===" -ForegroundColor Magenta
    Write-Host "Script: $Script" -ForegroundColor Gray
    
    try {
        # Check if script exists
        if (-not (Test-Path $Script)) {
            Write-Host "ERROR: Script not found: $Script" -ForegroundColor Red
            return $false
        }
        
        # Run the script
        $startTime = Get-Date
        & ".\$Script"
        $endTime = Get-Date
        $duration = $endTime - $startTime
        
        Write-Host "`n✅ $Name completed successfully" -ForegroundColor Green
        Write-Host "Duration: $($duration.TotalSeconds.ToString('F2')) seconds" -ForegroundColor Gray
        
        return $true
    }
    catch {
        Write-Host "`n❌ $Name failed" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Start backend if not running
Write-Host "`nChecking backend status..." -ForegroundColor Cyan

try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5026/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend is already running" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Backend not running, starting it..." -ForegroundColor Yellow
    
    # Start backend
    Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", "backend" -WindowStyle Hidden
    
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 20
    
    # Check if backend started successfully
    try {
        $healthResponse = Invoke-RestMethod -Uri "http://localhost:5026/health" -Method GET -TimeoutSec 10
        Write-Host "✅ Backend started successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to start backend" -ForegroundColor Red
        Write-Host "Please start the backend manually: cd backend && dotnet run" -ForegroundColor Yellow
        exit 1
    }
}

# Run all test scripts
Write-Host "`n=== STARTING TEST SUITE ===" -ForegroundColor Magenta

foreach ($test in $testScripts) {
    $results[$test.Name] = Run-TestScript -Name $test.Name -Script $test.Script
    
    # Wait between tests
    if ($test -ne $testScripts[-1]) {
        Write-Host "`nWaiting 5 seconds before next test..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
}

# Summary
Write-Host "`n=== TEST SUITE SUMMARY ===" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Green

$totalTests = $results.Count
$passedTests = ($results.Values | Where-Object { $_ -eq $true }).Count
$failedTests = $totalTests - $passedTests

Write-Host "Total Test Suites: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passedTests / $totalTests) * 100, 2))%" -ForegroundColor Cyan

Write-Host "`nDetailed Results:" -ForegroundColor Yellow
foreach ($result in $results.GetEnumerator()) {
    $status = if ($result.Value) { "PASS" } else { "FAIL" }
    $color = if ($result.Value) { "Green" } else { "Red" }
    Write-Host "$status - $($result.Key)" -ForegroundColor $color
}

# Recommendations
Write-Host "`n=== RECOMMENDATIONS ===" -ForegroundColor Magenta

if ($failedTests -gt 0) {
    Write-Host "❌ Some tests failed. Please check:" -ForegroundColor Red
    Write-Host "• Backend logs for errors" -ForegroundColor Yellow
    Write-Host "• Database connectivity" -ForegroundColor Yellow
    Write-Host "• OpenAI API key configuration" -ForegroundColor Yellow
    Write-Host "• Network connectivity" -ForegroundColor Yellow
} else {
    Write-Host "✅ All tests passed! Your backend is working correctly." -ForegroundColor Green
}

Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Magenta
Write-Host "1. If OpenAI tests failed, run: .\enable-openai-integration.ps1" -ForegroundColor White
Write-Host "2. Set your OpenAI API key if not already done" -ForegroundColor White
Write-Host "3. Test the frontend integration" -ForegroundColor White
Write-Host "4. Deploy to production" -ForegroundColor White

Write-Host "`n=== USEFUL COMMANDS ===" -ForegroundColor Magenta
Write-Host "• Start backend: cd backend && dotnet run" -ForegroundColor Gray
Write-Host "• Test specific endpoint: .\openai-test.ps1" -ForegroundColor Gray
Write-Host "• Enable OpenAI: .\enable-openai-integration.ps1" -ForegroundColor Gray
Write-Host "• View logs: Get-Content backend/logs/*.txt" -ForegroundColor Gray

Write-Host "`nMaster Test Suite Completed!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Cleanup
Write-Host "`nCleaning up..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*dotnet*"} | Stop-Process -Force
Write-Host "Backend stopped." -ForegroundColor Yellow 