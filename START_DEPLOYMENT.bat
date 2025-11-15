@echo off
REM ============================================
REM FLIPKART CLONE - ONE-CLICK DEPLOYMENT
REM ============================================
REM This script automates the entire setup

setlocal enabledelayedexpansion

cls
echo.
echo ============================================
echo FLIPKART CLONE - AUTOMATED DEPLOYMENT
echo ============================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found
    echo Install from: https://www.python.org/
    pause
    exit /b 1
)

REM Check SSH
ssh -V >nul 2>&1
if errorlevel 1 (
    echo ERROR: SSH not found
    echo Using Git Bash or Windows Terminal with OpenSSH
    pause
    exit /b 1
)

REM Run deployer
echo.
echo Starting automated deployment...
echo.

python "%~dp0deployer.py"

if errorlevel 1 (
    echo.
    echo Deployment failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo DEPLOYMENT COMPLETE
echo ============================================
echo.
pause
