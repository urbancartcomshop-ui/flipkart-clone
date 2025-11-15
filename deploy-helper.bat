@echo off
REM Flipkart Clone - Vercel Deployment Helper for Windows

color 0A
cls

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║   🚀 FLIPKART CLONE - DEPLOYMENT HELPER (WINDOWS)         ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js installed

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)
echo ✅ npm installed

REM Check if Vercel CLI is installed globally
vercel --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo 📦 Installing Vercel CLI globally...
    call npm install -g vercel
)
echo ✅ Vercel CLI installed

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo Please install from: https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git installed

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                    DEPLOYMENT OPTIONS                     ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 1. Deploy via Vercel Dashboard (RECOMMENDED)
echo 2. Deploy via Vercel CLI (Automatic)
echo 3. Deploy via Heroku
echo 4. Deploy via Netlify
echo 5. Start Local Server
echo 6. View Deployment Guides
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo.
    echo 🌐 Opening Vercel Dashboard...
    echo.
    echo Follow these steps:
    echo 1. Click "New Project"
    echo 2. Select your GitHub repository
    echo 3. Set root directory to "public"
    echo 4. Click "Deploy"
    echo.
    start https://vercel.com/dashboard
    pause
) else if "%choice%"=="2" (
    echo.
    echo 🚀 Deploying to Vercel...
    echo.
    call vercel --prod
    pause
) else if "%choice%"=="3" (
    echo.
    echo 🌐 Opening Heroku...
    start https://www.heroku.com
    echo See VERCEL_MANUAL_DEPLOY.md for Heroku instructions
    pause
) else if "%choice%"=="4" (
    echo.
    echo 🌐 Opening Netlify...
    start https://netlify.com
    echo See VERCEL_MANUAL_DEPLOY.md for Netlify instructions
    pause
) else if "%choice%"=="5" (
    echo.
    echo 🚀 Starting Local Server...
    call npm start
) else if "%choice%"=="6" (
    echo.
    echo 📖 Opening Deployment Guide...
    start notepad VERCEL_MANUAL_DEPLOY.md
) else if "%choice%"=="7" (
    echo Goodbye! 👋
    exit /b 0
) else (
    echo ❌ Invalid choice. Please try again.
    timeout /t 2 >nul
    goto start
)

endlocal
pause
