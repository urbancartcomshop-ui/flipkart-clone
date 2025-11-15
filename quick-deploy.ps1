# Quick deploy - waits for Docker, then deploys to AWS af-south-1
param([string]$Region = 'af-south-1')

Write-Host "Waiting for Docker to be ready..." -ForegroundColor Cyan
$dockerReady = $false
for ($i=0; $i -lt 120; $i++) {
    try {
        docker version | Out-Null
        $dockerReady = $true
        break
    } catch {
        Start-Sleep -Seconds 5
        Write-Host "  Still waiting for Docker engine..." -ForegroundColor DarkGray
    }
}

if (-not $dockerReady) {
    throw "Docker did not start. Please open Docker Desktop manually, wait until it shows Running, then rerun this script."
}

Write-Host "Docker is ready. Starting deployment..." -ForegroundColor Green

# Get AWS account
$who = aws sts get-caller-identity | ConvertFrom-Json
$AccountId = $who.Account
Write-Host "AWS Account: $AccountId" -ForegroundColor Cyan

# Build and push to ECR
$AppName = 'flipko-api'
Write-Host "Creating ECR repository..." -ForegroundColor Cyan
aws ecr create-repository --repository-name $AppName --region $Region 2>$null | Out-Null

$RepoUri = "$AccountId.dkr.ecr.$Region.amazonaws.com/$AppName"
Write-Host "Logging into ECR..." -ForegroundColor Cyan
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com" | Out-Null

Write-Host "Building Docker image..." -ForegroundColor Cyan
docker build -t flipko-api:latest .
docker tag flipko-api:latest "$($RepoUri):latest"

Write-Host "Pushing image to ECR..." -ForegroundColor Cyan
docker push "$($RepoUri):latest"

Write-Host "`nDeployment preparation complete!" -ForegroundColor Green
Write-Host "Image URI: $($RepoUri):latest" -ForegroundColor Yellow
Write-Host "`nNext: You can now deploy via:" -ForegroundColor Cyan
Write-Host "  - App Runner (if available in $Region)" -ForegroundColor Gray
Write-Host "  - Or run: cd deploy/terraform ; terraform init ; terraform apply" -ForegroundColor Gray
