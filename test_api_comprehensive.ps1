# Comprehensive API test script
Write-Host "Testing SQL Dialect Converter API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Dialects endpoint
Write-Host "1. Testing /api/dialects endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/dialects" -UseBasicParsing
    $dialects = $response.Content | ConvertFrom-Json
    Write-Host "   Status: SUCCESS" -ForegroundColor Green
    Write-Host "   Dialects: $($dialects.dialects -join ', ')" -ForegroundColor White
} catch {
    Write-Host "   Status: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Formats endpoint
Write-Host "2. Testing /api/formats endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/formats" -UseBasicParsing
    $formats = $response.Content | ConvertFrom-Json
    Write-Host "   Status: SUCCESS" -ForegroundColor Green
    Write-Host "   Formats: $($formats.formats -join ', ')" -ForegroundColor White
} catch {
    Write-Host "   Status: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Parse SQL endpoint
Write-Host "3. Testing /api/parse-sql endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        sql_text = "SELECT * FROM users WHERE id = 1; SELECT name FROM products;"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/parse-sql" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing
    
    $result = $response.Content | ConvertFrom-Json
    Write-Host "   Status: SUCCESS" -ForegroundColor Green
    Write-Host "   Statements parsed: $($result.count)" -ForegroundColor White
    Write-Host "   Statements:" -ForegroundColor White
    $result.statements | ForEach-Object { Write-Host "     - $_" -ForegroundColor Gray }
} catch {
    Write-Host "   Status: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "API tests completed!" -ForegroundColor Cyan
