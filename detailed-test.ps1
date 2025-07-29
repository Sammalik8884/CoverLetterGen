$body = @{
    jobTitle = "Frontend Developer"
    companyName = "Acme Corp"
    userInfo = "3 years React experience, remote work background"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5026/generate" -Method POST -ContentType "application/json" -Body $body
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Error Response: $responseBody"
    $reader.Close()
} 