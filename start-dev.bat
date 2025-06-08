@echo off
echo Starting Pet Mart Application...

echo Starting Backend Server...
start cmd /k "mvnw.cmd spring-boot:run"

echo Waiting for backend to initialize...
timeout /t 5

echo Starting Frontend Server...
cd frontend
start cmd /k "npm start"

echo Both servers are running!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each window to stop the servers 