# Start the backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./mvnw spring-boot:run"

# Start the frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/frontend'; npm run start" 