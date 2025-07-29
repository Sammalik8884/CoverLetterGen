try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/" -Method GET
    Write-Host "Backend is running. Status: $($response.StatusCode)"
} catch {
    Write-Host "Backend connection error: $($_.Exception.Message)"
} 