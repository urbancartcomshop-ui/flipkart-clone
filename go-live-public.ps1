#!/usr/bin/env pwsh

# Flipkart Clone - PUBLIC SERVER DEPLOYER
# Makes your local server LIVE to the WORLD with a public URL
# Works with ngrok tunneling (free)

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      FLIPKART CLONE - PUBLIC WORLD SERVER                 ║" -ForegroundColor Cyan
Write-Host "║      Going Live Now - Your URL Will Be Shareable!         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

$ngrokVersion = ngrok --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: ngrok not found. Installing..." -ForegroundColor Yellow
    npm install -g ngrok
}

Write-Host "ngrok: Ready" -ForegroundColor Green
Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Dependencies: Ready" -ForegroundColor Green
Write-Host ""

# Start local server in background
Write-Host "Starting local Express server on port 3000..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "index.js" -PassThru -NoNewWindow

# Wait for server to start
Start-Sleep -Seconds 3

# Check if server started
$testUrl = "http://localhost:3000" 
$testResponse = $null
try {
    $testResponse = Invoke-WebRequest -Uri $testUrl -ErrorAction SilentlyContinue
} catch {}

if ($null -eq $testResponse) {
    Write-Host "ERROR: Local server failed to start!" -ForegroundColor Red
    Stop-Process -Id $serverProcess.Id -Force
    exit 1
}

Write-Host "Local server: Running on http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Create ngrok configuration
Write-Host "Creating ngrok public tunnel..." -ForegroundColor Yellow
$ngrokOutput = ngrok http 3000 --log=stdout 2>&1

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              YOUR SITE IS NOW LIVE!                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Check the output above for your PUBLIC URL" -ForegroundColor Cyan
Write-Host "It will look like: https://xxxxx-xx-xxx-xxx.ngrok-free.app" -ForegroundColor White
Write-Host ""

Write-Host "Your site includes:" -ForegroundColor Yellow
Write-Host "  ✅ 32 Products from India" -ForegroundColor Green
Write-Host "  ✅ Indian Customer Reviews" -ForegroundColor Green
Write-Host "  ✅ UPI Payment Integration" -ForegroundColor Green
Write-Host "  ✅ Mobile Responsive Design" -ForegroundColor Green
Write-Host "  ✅ Full Search & Filters" -ForegroundColor Green
Write-Host ""

Write-Host "Share this URL with anyone!" -ForegroundColor Yellow
Write-Host "It will work on their browser from anywhere in the world!" -ForegroundColor White
Write-Host ""

Write-Host "To stop: Press Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Keep ngrok running
$ngrokOutput | ForEach-Object { $_ }
