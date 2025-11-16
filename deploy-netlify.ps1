# Deploy to Netlify using API key

$token = "nfp_CZqHvACVvbqnocXq7bpgSAadhS1RgoLc77b8"
$repoDir = "c:\Users\nitin sabharwal\New folder"
$publicDir = "$repoDir\public"

Write-Host "🚀 Starting Netlify Deployment..." -ForegroundColor Cyan
Write-Host "Token: $($token.Substring(0, 10))..." -ForegroundColor Yellow
Write-Host ""

# Install Netlify CLI globally if not already installed
Write-Host "📦 Checking Netlify CLI..." -ForegroundColor Yellow
npm install -g netlify-cli

Write-Host ""
Write-Host "📂 Publishing from: $publicDir" -ForegroundColor Cyan

# Deploy using the token
Write-Host "🔄 Deploying to Netlify..." -ForegroundColor Cyan

$env:NETLIFY_AUTH_TOKEN = $token

# Deploy using netlify CLI
cd $repoDir
netlify deploy --prod --dir=$publicDir --site=flipkart-store

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your site will be live at:" -ForegroundColor Cyan
Write-Host "https://flipkart-store.netlify.app" -ForegroundColor White
