# Custom Flipkart Deployer for PowerShell
# This script deploys the Flipkart clone to any Linux server via SSH

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " FLIPKART CLONE - CUSTOM DEPLOYER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install from: https://www.python.org/" -ForegroundColor Yellow
    exit 1
}

# Check if SSH is available
try {
    ssh -V 2>&1 | Out-Null
    Write-Host "✅ SSH found" -ForegroundColor Green
}
catch {
    Write-Host "❌ SSH is not available" -ForegroundColor Red
    Write-Host "Please install OpenSSH or use Windows Subsystem for Linux" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Run the Python deployer
$scriptPath = Join-Path $PSScriptRoot "deployer.py"
python $scriptPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
