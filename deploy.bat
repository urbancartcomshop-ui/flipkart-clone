@echo off
REM Custom Flipkart Deployer for Windows
REM This script deploys the Flipkart clone to any Linux server via SSH

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  FLIPKART CLONE - CUSTOM DEPLOYER
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    exit /b 1
)

REM Run the Python deployer
python "%~dp0deployer.py"
if errorlevel 1 (
    echo.
    echo Deployment failed
    exit /b 1
)

echo.
echo Deployment completed successfully!
pause
