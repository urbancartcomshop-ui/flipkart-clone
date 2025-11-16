#!/usr/bin/env pwsh

# Flipkart Africa India - Branded Store Launcher
# Creates shareable branded links

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       FLIPKART AFRICA INDIA - BRANDED STORE SETUP         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting branded server..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "branded-server.js" -PassThru -NoNewWindow

Start-Sleep -Seconds 3

Write-Host "✅ Server started!" -ForegroundColor Green
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║            YOUR BRANDED STORE IS LIVE!                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 BRANDED NAMES (Recommended for Sharing):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   📌 plipkart - Professional Flipkart" -ForegroundColor Cyan
Write-Host "   📌 flipko - Flipkart Store Abbreviation" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 HOW TO USE BRANDED NAMES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Buy Domain & Point to Your IP" -ForegroundColor Gray
Write-Host "  1. Buy domain from GoDaddy/Namecheap" -ForegroundColor Gray
Write-Host "  2. Set A record to: 223.185.58.231" -ForegroundColor Gray
Write-Host "  3. Use branded URL: plipkart.africa or flipko.store" -ForegroundColor Gray
Write-Host ""

Write-Host "Option 2: Use Current IP (Works Now!)" -ForegroundColor Gray
Write-Host "  Share: http://223.185.58.231:3000" -ForegroundColor White -BackgroundColor DarkCyan
Write-Host ""

Write-Host "🔗 BRANDED ROUTE PATHS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   • plipkart.africa/" -ForegroundColor Cyan
Write-Host "   • flipko.store/" -ForegroundColor Cyan
Write-Host "   • flipko.store/store" -ForegroundColor Cyan
Write-Host "   • flipko.store/africa" -ForegroundColor Cyan
Write-Host "   • flipko.store/india" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 API ENDPOINTS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   • /api/products - All 32 products" -ForegroundColor Cyan
Write-Host "   • /api/search?q=OnePlus - Search" -ForegroundColor Cyan
Write-Host "   • /api/stats - Statistics" -ForegroundColor Cyan
Write-Host "   • /api/featured - Top products" -ForegroundColor Cyan
Write-Host ""

Write-Host "✨ FEATURES:" -ForegroundColor Yellow
Write-Host "   ✅ 32 Indian Products" -ForegroundColor Green
Write-Host "   ✅ Indian Reviews" -ForegroundColor Green
Write-Host "   ✅ UPI Payment" -ForegroundColor Green
Write-Host "   ✅ Mobile Responsive" -ForegroundColor Green
Write-Host ""

Write-Host "🗺️  SERVER INFO:" -ForegroundColor Yellow
Write-Host "   📍 Location: Africa (South Africa)" -ForegroundColor Cyan
Write-Host "   🇮🇳 Market: India" -ForegroundColor Cyan
Write-Host "   💰 Currency: INR (₹)" -ForegroundColor Cyan
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Your branded store is ready! Keep terminal open to run.   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
