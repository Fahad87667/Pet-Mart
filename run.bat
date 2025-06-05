@echo off
echo Checking if JAR file exists...
if not exist "target\OnlinePetStore-0.0.1-SNAPSHOT.jar" (
    echo Building project first...
    call mvnw.cmd clean package
    if errorlevel 1 (
        echo Build failed!
        pause
        exit /b 1
    )
)

echo Starting application...
java -Xms256m -Xmx512m -XX:MaxMetaspaceSize=128m -jar target/OnlinePetStore-0.0.1-SNAPSHOT.jar
if errorlevel 1 (
    echo Application failed to start!
    pause
    exit /b 1
) 