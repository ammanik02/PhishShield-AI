@echo off
REM PhishShield AI - Installation Script
REM For Windows

echo.
echo ========================================
echo   PhishShield AI - Installation Script
echo ========================================
echo.

REM Check Python
echo Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed. Please install Python 3.11 or higher.
    pause
    exit /b 1
)
echo Python found!

REM Check Node.js
echo Checking Node.js version...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)
echo Node.js found!

echo.
echo Setting up Backend...
echo ------------------------

REM Backend setup
cd backend

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo Created .env file
) else (
    echo .env file already exists, skipping...
)

cd ..

echo.
echo Setting up Frontend...
echo ------------------------

REM Frontend setup
cd frontend

echo Installing Node.js dependencies...
call npm install

echo Creating .env.local file...
if not exist .env.local (
    echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
    echo Created .env.local file
) else (
    echo .env.local file already exists, skipping...
)

cd ..

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn main:app --reload
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo For more information, see:
echo   - QUICKSTART.md
echo   - SETUP_GUIDE.md
echo.
echo Happy scanning!
echo.
pause
