# Flipkart Clone - Docker Deployment

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "FLIPKART CLONE - DOCKER DEPLOYMENT" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
docker --version 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker not installed!" -ForegroundColor Red
    Write-Host "Install from: https://www.docker.com/products/docker-desktop"
    exit 1
}

Write-Host "Docker is installed" -ForegroundColor Green
Write-Host ""

# Stop existing
Write-Host "Cleaning up..." -ForegroundColor Yellow
docker stop flipkart-clone 2>&1 | Out-Null
docker rm flipkart-clone 2>&1 | Out-Null

# Build
Write-Host "Building image..." -ForegroundColor Yellow
docker build -t flipkart-clone:latest .

# Run
Write-Host "Starting container..." -ForegroundColor Yellow
docker run -d --name flipkart-clone -p 3000:3000 --restart unless-stopped flipkart-clone:latest

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Site running at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Commands:" -ForegroundColor Yellow
Write-Host "  Logs:    docker logs flipkart-clone"
Write-Host "  Stop:    docker stop flipkart-clone"
Write-Host "  Restart: docker restart flipkart-clone"
Write-Host ""

Start-Sleep -Seconds 2
Start-Process http://localhost:3000
