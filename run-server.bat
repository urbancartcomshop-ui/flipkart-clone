@echo off
REM Flipkart Clone - Standalone Deployer
REM This deploys your site WITHOUT GitHub or external services
REM Works 100% offline once deployed

setlocal enabledelayedexpansion

echo.
echo ================================
echo FLIPKART CLONE - STANDALONE DEPLOYER
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    echo Download from: https://nodejs.org
    exit /b 1
)

echo [OK] Node.js installed

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found!
    exit /b 1
)

echo [OK] npm installed
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    exit /b 1
)

echo [OK] Dependencies installed
echo.

REM Start server
echo.
echo ================================
echo STARTING SERVER...
echo ================================
echo.
echo Your Flipkart site is running at:
echo.
echo   http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo Available:
echo   - Homepage with 32 products
echo   - Indian reviews and UPI payment
echo   - Search and filters
echo   - Product details
echo   - Mobile responsive design
echo.

call npm start
