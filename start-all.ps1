# Start Pet Mart Application
Write-Host "Starting Pet Mart Application..." -ForegroundColor Green

# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $connection = New-Object System.Net.Sockets.TcpClient
    try {
        $connection.Connect("127.0.0.1", $port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Start backend
Write-Host "Starting Backend..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath ".\run.bat" -NoNewWindow -PassThru

# Wait for backend to start
$maxAttempts = 30
$attempts = 0
while ($attempts -lt $maxAttempts) {
    if (Test-PortInUse 8080) {
        Write-Host "Backend is running on port 8080" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $attempts++
}

# Start frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
$frontendJob = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory ".\src\main\resources\static\react-app" -NoNewWindow -PassThru

# Wait for frontend to start
$attempts = 0
while ($attempts -lt $maxAttempts) {
    if (Test-PortInUse 3000) {
        Write-Host "Frontend is running on port 3000" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $attempts++
}

Write-Host "`nApplication is running!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep the script running and handle cleanup on exit
try {
    Wait-Event
}
finally {
    Write-Host "`nStopping services..." -ForegroundColor Yellow
    Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Services stopped" -ForegroundColor Green
} 