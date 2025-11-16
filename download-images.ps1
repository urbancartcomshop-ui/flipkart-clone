# Generate product placeholder images

$imagesDir = "c:\Users\nitin sabharwal\New folder\public\images"

# Create images directory
if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
    Write-Host "Created images folder" -ForegroundColor Green
}

Write-Host "Generating product images..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0

# Use placeholder image service for all 32 products
for ($i = 1; $i -le 32; $i++) {
    $filename = "product-$i.jpg"
    $localPath = Join-Path $imagesDir $filename
    
    try {
        Write-Host "[$i/32] Generating: $filename"
        
        # Use placeholder service
        $imageUrl = "https://placehold.co/300x300/4A90E2/ffffff?text=Product+$i"
        
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($imageUrl, $localPath)
        
        Write-Host "    Saved: $filename" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "    Failed" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Host "Generated: $successCount/32 images" -ForegroundColor Green
