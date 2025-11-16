#!/usr/bin/env pwsh

# QUICK START - Make Your Flipkart Site LIVE to the World RIGHT NOW

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         FLIPKART CLONE - GO LIVE TO THE WORLD              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Start local server
Write-Host "STEP 1: Starting local server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "index.js" -PassThru -NoNewWindow

Start-Sleep -Seconds 2

Write-Host "Local server started!" -ForegroundColor Green
Write-Host ""

# Step 2: Create public tunnel with ngrok
Write-Host "STEP 2: Creating public tunnel with ngrok..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your site will be LIVE in 5 seconds..." -ForegroundColor Cyan
Write-Host ""

# Start ngrok and capture output
& ngrok http 3000
