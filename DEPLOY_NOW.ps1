#!/usr/bin/env powershell

# One-Click Deployment Setup for Flipkart Clone
# This script prepares your app for deployment

Write-Host "=== Flipkart Clone Deployment Setup ===" -ForegroundColor Green
Write-Host ""

# Check if git is configured
Write-Host "✓ Checking git configuration..."
$remoteUrl = git config --get remote.origin.url
if ($remoteUrl -like "*YOUR_USERNAME*") {
    Write-Host "⚠ GitHub remote not configured. You need to:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Create a GitHub repository at https://github.com/new"
    Write-Host "2. Run these commands:"
    Write-Host "   git remote remove origin"
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/flipkart-clone.git"
    Write-Host "   git branch -M main"
    Write-Host "   git push -u origin main"
    Write-Host ""
} else {
    Write-Host "✓ Git remote configured: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Deployment Options ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. RENDER (Recommended) - https://render.com"
Write-Host "   - Free tier available"
Write-Host "   - Auto-deploys from GitHub"
Write-Host "   - Steps:"
Write-Host "     a) Go to https://render.com"
Write-Host "     b) Click 'New +' → 'Web Service'"
Write-Host "     c) Connect GitHub repo"
Write-Host "     d) Set Build Command: npm install"
Write-Host "     e) Set Start Command: node server.js"
Write-Host ""
Write-Host "2. VERCEL - https://vercel.com"
Write-Host "   - Great for frontend"
Write-Host "   - Deploy by importing GitHub repo"
Write-Host ""
Write-Host "3. RAILWAY - https://railway.app"
Write-Host "   - Simple Node.js deployment"
Write-Host "   - Deploy by connecting GitHub"
Write-Host ""
Write-Host "4. NETLIFY + NETLIFY FUNCTIONS"
Write-Host "   - Deploy from repository"
Write-Host "   - Netlify will automatically detect Node.js"
Write-Host ""

Write-Host "=== What to Do Next ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push code to GitHub:"
Write-Host "   git push origin main"
Write-Host ""
Write-Host "2. Visit one of the deployment platforms above"
Write-Host "3. Connect your GitHub repository"
Write-Host "4. Set build/start commands (already in package.json)"
Write-Host "5. Deploy!"
Write-Host ""
Write-Host "Your app will be live in 2-5 minutes!" -ForegroundColor Green
