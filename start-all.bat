@echo off
echo Starting Pet Mart Application...

:: Start the backend in a new window
start "Pet Mart Backend" cmd /k "cd %~dp0 && .\run.bat"

:: Wait a few seconds for backend to initialize
timeout /t 10 /nobreak

:: Start the frontend in a new window
start "Pet Mart Frontend" cmd /k "cd %~dp0\src\main\resources\static\react-app && npm start"

echo Both services are starting...
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:3000 