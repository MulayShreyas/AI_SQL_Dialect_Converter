@echo off
echo ========================================
echo SQL Dialect Converter - Setup Script
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Setting up Backend...
echo.

REM Navigate to backend directory
cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install backend dependencies
echo Installing backend dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env and add your OpenRouter API key
    echo Get your API key from: https://openrouter.ai
    echo.
)

REM Deactivate virtual environment
deactivate

cd ..

echo.
echo [2/4] Setting up Frontend...
echo.

REM Navigate to frontend directory
cd frontend

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit backend\.env and add your OpenRouter API key
echo    Get it from: https://openrouter.ai
echo.
echo 2. Start the backend:
echo    cd backend
echo    venv\Scripts\activate
echo    python main.py
echo.
echo 3. In a new terminal, start the frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo For more information, see README.md
echo ========================================
pause
