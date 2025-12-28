# Test SQL parsing endpoint
$body = @{
    sql_text = "SELECT * FROM users WHERE id = 1;"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/api/parse-sql" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body `
    -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
