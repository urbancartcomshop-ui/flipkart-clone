#!/usr/bin/env pwsh

# Flipkart Clone - Professional Public Server Setup
# Creates a shareable permanent link for your Flipkart site

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      FLIPKART CLONE - PROFESSIONAL PUBLIC DOMAIN SETUP     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Start Node server
Write-Host "STEP 1: Starting Express server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "index.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 3

# Step 2: Create ngrok tunnel with persistent domain
Write-Host "STEP 2: Creating permanent public URL with ngrok..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your site will get a permanent shareable link!" -ForegroundColor Green
Write-Host ""

& ngrok http 3000 --region=eu
