$productsPath = "c:\Users\nitin sabharwal\New folder\public\products.json"

# Read products.json
$products = Get-Content $productsPath -Raw | ConvertFrom-Json

# Update all image URLs to local paths
for ($i = 0; $i -lt $products.Count; $i++) {
    $productId = $products[$i].id
    $products[$i].image = "images/product-$productId.jpg"
}

# Save updated products.json
$products | ConvertTo-Json -Depth 10 | Set-Content $productsPath

Write-Host "Updated all image URLs to local paths" -ForegroundColor Green
Write-Host "32 products now use: /images/product-X.jpg" -ForegroundColor Cyan
