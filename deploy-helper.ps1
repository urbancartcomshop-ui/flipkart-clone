#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Flipkart Clone - Vercel Deployment Helper (PowerShell)

.DESCRIPTION
    Interactive deployment script for Windows PowerShell

.EXAMPLE
    .\deploy-helper.ps1
#>

# Colors
$colors = @{
    Green  = "`e[32m"
    Yellow = "`e[33m"
    Blue   = "`e[34m"
    Cyan   = "`e[36m"
    Red    = "`e[31m"
    Reset  = "`e[0m"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "Reset"
    )
    Write-Host "$($colors[$Color])$Message$($colors['Reset'])"
}

function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Clear screen and show header
Clear-Host
Write-ColorOutput "`n" "Blue"
Write-ColorOutput "╔═══════════════════════════════════════════════════════════╗" "Blue"
Write-ColorOutput "║   🚀 FLIPKART CLONE - DEPLOYMENT HELPER (POWERSHELL)      ║" "Blue"
Write-ColorOutput "╚═══════════════════════════════════════════════════════════╝" "Blue"
Write-ColorOutput "`n"

# Check prerequisites
Write-ColorOutput "📋 Checking Prerequisites..." "Cyan"

# Check Node.js
if (Test-Command node) {
    $nodeVersion = node --version
    Write-ColorOutput "✅ Node.js installed: $nodeVersion" "Green"
} else {
    Write-ColorOutput "❌ Node.js not installed! Install from: https://nodejs.org/" "Yellow"
    exit 1
}

# Check npm
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-ColorOutput "✅ npm installed: $npmVersion" "Green"
} else {
    Write-ColorOutput "❌ npm not installed!" "Yellow"
    exit 1
}

# Check Git
if (Test-Command git) {
    Write-ColorOutput "✅ Git installed" "Green"
} else {
    Write-ColorOutput "❌ Git not installed!" "Yellow"
    exit 1
}

# Check Vercel CLI
if (Test-Command vercel) {
    $vercelVersion = vercel --version
    Write-ColorOutput "✅ Vercel CLI installed: $vercelVersion" "Green"
} else {
    Write-ColorOutput "⚠️  Vercel CLI not found. Installing globally..." "Yellow"
    npm install -g vercel
}

# Show menu
Write-ColorOutput "`n╔═══════════════════════════════════════════════════════════╗" "Cyan"
Write-ColorOutput "║                    DEPLOYMENT OPTIONS                     ║" "Cyan"
Write-ColorOutput "╚═══════════════════════════════════════════════════════════╝" "Cyan"
Write-ColorOutput @"

1. 🌐 Deploy via Vercel Dashboard (RECOMMENDED)
2. 🚀 Deploy via Vercel CLI (Automatic)
3. 🔵 Deploy via Heroku
4. 🟢 Deploy via Netlify
5. 💻 Start Local Server
6. 📖 View Deployment Guides
7. 📊 Check GitHub Status
8. 🔄 Pull Latest Changes
9. ❌ Exit

" "Cyan"

$choice = Read-Host "Enter your choice (1-9)"

Write-ColorOutput "`n"

switch ($choice) {
    "1" {
        Write-ColorOutput "🌐 Opening Vercel Dashboard..." "Blue"
        Write-ColorOutput @"

Follow these steps:
  1. Click "New Project" button
  2. Click "Import Git Repository"
  3. Select your GitHub repository: urbancartcomshop-ui/flipkart-clone
  4. Set root directory to: public
  5. Click "Deploy"

Opening browser now...
" "Cyan"
        Start-Process "https://vercel.com/dashboard"
        Read-Host "Press Enter when done..."
    }
    
    "2" {
        Write-ColorOutput "🚀 Deploying to Vercel via CLI..." "Blue"
        Write-ColorOutput "This will deploy your site to production..." "Yellow"
        Write-ColorOutput "`n"
        vercel --prod
    }
    
    "3" {
        Write-ColorOutput "🔵 Opening Heroku Dashboard..." "Blue"
        Start-Process "https://www.heroku.com"
        Write-ColorOutput "See VERCEL_MANUAL_DEPLOY.md for detailed Heroku instructions" "Yellow"
        Read-Host "Press Enter when done..."
    }
    
    "4" {
        Write-ColorOutput "🟢 Opening Netlify Dashboard..." "Blue"
        Start-Process "https://netlify.com"
        Write-ColorOutput "See VERCEL_MANUAL_DEPLOY.md for detailed Netlify instructions" "Yellow"
        Read-Host "Press Enter when done..."
    }
    
    "5" {
        Write-ColorOutput "💻 Starting Local Server..." "Blue"
        Write-ColorOutput "Your site will be at: http://localhost:3000" "Green"
        Write-ColorOutput "Press Ctrl+C to stop the server" "Yellow"
        Write-ColorOutput "`n"
        npm start
    }
    
    "6" {
        Write-ColorOutput "📖 Opening Deployment Guides..." "Blue"
        $docFiles = @(
            @{ Name = "Vercel Manual Deploy"; File = "VERCEL_MANUAL_DEPLOY.md" },
            @{ Name = "Post-Deployment Checklist"; File = "POST_DEPLOYMENT_CHECKLIST.md" },
            @{ Name = "Deployment Complete"; File = "DEPLOYMENT_COMPLETE.md" }
        )
        
        Write-ColorOutput "`n📄 Available Guides:`n" "Cyan"
        for ($i = 0; $i -lt $docFiles.Count; $i++) {
            Write-ColorOutput "  $($i+1). $($docFiles[$i].Name)" "Cyan"
        }
        
        $docChoice = Read-Host "`nEnter number (1-$($docFiles.Count))"
        if ($docChoice -gt 0 -and $docChoice -le $docFiles.Count) {
            $selectedFile = $docFiles[$docChoice - 1].File
            if (Test-Path $selectedFile) {
                Invoke-Item $selectedFile
            } else {
                Write-ColorOutput "❌ File not found: $selectedFile" "Red"
            }
        }
    }
    
    "7" {
        Write-ColorOutput "📊 Git Status..." "Blue"
        Write-ColorOutput "`n"
        git status
        Write-ColorOutput "`n📋 Recent Commits:" "Cyan"
        git log --oneline -5
        Read-Host "`nPress Enter to continue..."
    }
    
    "8" {
        Write-ColorOutput "🔄 Pulling Latest Changes..." "Blue"
        git pull origin main
        Write-ColorOutput "`n✅ Done!" "Green"
        Read-Host "Press Enter to continue..."
    }
    
    "9" {
        Write-ColorOutput "Goodbye! 👋" "Green"
        exit 0
    }
    
    default {
        Write-ColorOutput "❌ Invalid choice. Please try again." "Red"
        Start-Sleep -Seconds 2
    }
}

Write-ColorOutput "`nThank you for using Flipkart Clone Deployment Helper! 🚀" "Green"
