@echo off
echo ========================================
echo Starting SQL Dialect Converter
echo ========================================
echo.

REM Start backend in a new window
echo Starting Backend Server...
start "SQL Converter - Backend" cmd /k "cd backend && venv\Scripts\uvicorn.exe main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
echo Starting Frontend Server...
start "SQL Converter - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill the processes
taskkill /FI "WindowTitle eq SQL Converter - Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq SQL Converter - Frontend*" /T /F >nul 2>&1

echo.
echo Servers stopped.
pause
