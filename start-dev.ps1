# Start both servers in the same console
Write-Host "Starting Pet Mart Application..." -ForegroundColor Green

# Start backend server
Write-Host "`nStarting Backend Server..." -ForegroundColor Blue
$backendJob = Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -PassThru

# Wait a few seconds for backend to initialize
Start-Sleep -Seconds 5

# Start frontend server
Write-Host "`nStarting Frontend Server..." -ForegroundColor Green
$frontendJob = Start-Process -FilePath "npm" -ArgumentList "run", "start" -WorkingDirectory ".\frontend" -NoNewWindow -PassThru

Write-Host "`nBoth servers are running in the same console!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8080" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop both servers" -ForegroundColor Yellow

# Keep the script running and handle cleanup on exit
try {
    Wait-Event
}
finally {
    Write-Host "`nStopping servers..." -ForegroundColor Yellow
    Stop-Process -Id $backendJob.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Servers stopped" -ForegroundColor Green
} 