#!/usr/bin/env pwsh

# Flipkart Clone - Heroku Deployment Script
# This script automates the entire Heroku deployment process

Write-Host "================================" -ForegroundColor Cyan
Write-Host "FLIPKART CLONE - HEROKU DEPLOYER" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Heroku CLI is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$herokuCheck = heroku --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Heroku CLI not found!" -ForegroundColor Red
    Write-Host "Download from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host "Heroku CLI found: $herokuCheck" -ForegroundColor Green
Write-Host ""

# Check if Git is installed
$gitCheck = git --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Git not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Git found: $gitCheck" -ForegroundColor Green
Write-Host ""

# Login to Heroku
Write-Host "Logging into Heroku..." -ForegroundColor Yellow
heroku login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Heroku login failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Logged into Heroku!" -ForegroundColor Green
Write-Host ""

# Create app name
$appName = "flipkart-clone-india-$(Get-Random -Minimum 1000 -Maximum 9999)"
Write-Host "Creating Heroku app: $appName" -ForegroundColor Yellow

heroku create $appName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create Heroku app!" -ForegroundColor Red
    exit 1
}

Write-Host "Heroku app created!" -ForegroundColor Green
Write-Host ""

# Deploy to Heroku
Write-Host "Deploying to Heroku..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray

git push heroku main

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Write-Host "Check logs with: heroku logs --tail" -ForegroundColor Yellow
    exit 1
}

Write-Host "Deployment successful!" -ForegroundColor Green
Write-Host ""

# Get app URL
Write-Host "Getting app URL..." -ForegroundColor Yellow
$appUrl = "https://$appName.herokuapp.com"
Write-Host "Your app is live at:" -ForegroundColor Green
Write-Host "Link: $appUrl" -ForegroundColor Cyan
Write-Host ""

# Display next steps
Write-Host "================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Quick Links:" -ForegroundColor Yellow
Write-Host "  Live Site: $appUrl" -ForegroundColor Cyan
Write-Host "  Mobile: $appUrl (responsive design)" -ForegroundColor Cyan
Write-Host "  Search: $appUrl (try 'OnePlus')" -ForegroundColor Cyan
Write-Host "  Products API: $appUrl/api/products" -ForegroundColor Cyan
Write-Host "  India Info: $appUrl/api/india-info" -ForegroundColor Cyan
Write-Host ""

Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "  View logs:        heroku logs --tail" -ForegroundColor Gray
Write-Host "  Restart app:      heroku restart" -ForegroundColor Gray
Write-Host "  Check status:     heroku ps" -ForegroundColor Gray
Write-Host "  Open in browser:  heroku open" -ForegroundColor Gray
Write-Host ""

Write-Host "Features Deployed:" -ForegroundColor Yellow
Write-Host "  32 Products with prices in INR" -ForegroundColor Green
Write-Host "  Indian customer reviews" -ForegroundColor Green
Write-Host "  UPI payment integration" -ForegroundColor Green
Write-Host "  Mobile responsive design" -ForegroundColor Green
Write-Host "  Full search and filter" -ForegroundColor Green
Write-Host "  Server in Africa, optimized for India" -ForegroundColor Green
Write-Host "  FREE hosting forever" -ForegroundColor Green
Write-Host ""

Write-Host "Test Your Site:" -ForegroundColor Yellow
Write-Host "  1. Visit: $appUrl" -ForegroundColor Cyan
Write-Host "  2. Search for 'OnePlus'" -ForegroundColor Cyan
Write-Host "  3. Click a product to see details" -ForegroundColor Cyan
Write-Host "  4. Click 'Buy Now' to test UPI payment" -ForegroundColor Cyan
Write-Host "  5. Try filters (category, price, rating)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Server: Africa (South Africa)" -ForegroundColor Cyan
Write-Host "Market: India" -ForegroundColor Cyan
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Happy Selling! Enjoy!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
