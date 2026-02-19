@echo off
REM Resume App - Quick Start Script

echo.
echo ================================================
echo    Resume App - Full Stack Quick Start
echo ================================================
echo.

REM Check if running from correct directory
if not exist "backend" (
    echo Error: backend folder not found!
    echo Please run this script from d:\resume directory
    pause
    exit /b 1
)

if not exist "resumeapp" (
    echo Error: resumeapp folder not found!
    echo Please run this script from d:\resume directory
    pause
    exit /b 1
)

echo Starting services...
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
mongosh --eval "db.version()" >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB might not be running!
    echo Please ensure MongoDB is running on localhost:27017
    echo.
)

REM Start backend in new window
echo Starting Backend Server (port 5000)...
start "Resume App Backend" cmd /k "cd /d %cd%\backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting Frontend Server (port 8080)...
start "Resume App Frontend" cmd /k "cd /d %cd%\resumeapp && npm run dev"

echo.
echo ================================================
echo Services starting...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080
echo MongoDB:  mongodb://localhost:27017
echo ================================================
echo.
echo Open your browser to http://localhost:8080
echo Close the terminal windows to stop servers.
echo.
pause
