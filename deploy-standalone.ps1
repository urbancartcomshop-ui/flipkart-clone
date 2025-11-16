#!/usr/bin/env pwsh

# Flipkart Clone - Standalone Deployer
# Zero external dependencies - 100% offline deployment
# No GitHub, No Heroku, No third-party services

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      FLIPKART CLONE - STANDALONE DEPLOYER                 ║" -ForegroundColor Cyan
Write-Host "║      Completely Offline • No External Dependencies         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host "npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

Write-Host "Dependencies installed!" -ForegroundColor Green
Write-Host ""

# Start server
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              SERVER STARTING...                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Your Flipkart site will run at:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🌐 http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "Available Features:" -ForegroundColor Yellow
Write-Host "  ✅ 32 Products from India (₹129-₹799)" -ForegroundColor Green
Write-Host "  ✅ Indian Customer Reviews (verified names & cities)" -ForegroundColor Green
Write-Host "  ✅ UPI Payment Integration" -ForegroundColor Green
Write-Host "  ✅ Full Search & Filters" -ForegroundColor Green
Write-Host "  ✅ Mobile Responsive Design" -ForegroundColor Green
Write-Host "  ✅ Complete E-commerce UI" -ForegroundColor Green
Write-Host ""

Write-Host "Test Commands:" -ForegroundColor Yellow
Write-Host "  Search:  http://localhost:3000 (search 'OnePlus')" -ForegroundColor Gray
Write-Host "  API:     http://localhost:3000/api/products" -ForegroundColor Gray
Write-Host "  Health:  http://localhost:3000/health" -ForegroundColor Gray
Write-Host ""

Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start server
npm start
