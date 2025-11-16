# Download Real Product Images Script
Write-Host "Starting product image download..." -ForegroundColor Cyan

$imageDir = "c:\Users\nitin sabharwal\New folder\public\images"
$productsDir = "$imageDir\products"

# Create directories if they don't exist
if (-not (Test-Path $imageDir)) { New-Item -ItemType Directory -Path $imageDir -Force | Out-Null }
if (-not (Test-Path $productsDir)) { New-Item -ItemType Directory -Path $productsDir -Force | Out-Null }

# Product images from reliable CDNs (Flipkart, Amazon)
$products = @(
    @{
        name = "OnePlus Buds Pro 2"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/b/h/c/buds-pro-2-oneplus-original-imagshbvs5t5dhkk.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/b/h/c/buds-pro-2-oneplus-original-imagshbvs5t5dhkk.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/s/n/g/buds-pro-2-oneplus-original-imagshbvsgmbzfhc.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/0/i/j/buds-pro-2-oneplus-original-imagshbvpqyzpehg.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/q/j/r/buds-pro-2-oneplus-original-imagshbvw23yfhfy.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/t/h/d/buds-pro-2-oneplus-original-imagshbvbfhvzuhm.jpeg"
        )
    },
    @{
        name = "JBL Wave Beam"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/s/e/i/-original-imagq4ghcyzw7spu.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/s/e/i/-original-imagq4ghcyzw7spu.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/c/j/q/-original-imagq4ghy2sdfgpe.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/g/i/i/-original-imagq4ghzw9hqfvc.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/k/u/t/-original-imagq4ghsqqkkgfh.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/t/f/z/-original-imagq4ghghvf3hvy.jpeg"
        )
    },
    @{
        name = "Noise Colorfit Icon 2"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/w/r/x/-original-imagvpakfvggsgg5.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/w/r/x/-original-imagvpakfvggsgg5.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/2/h/v/-original-imagvpakqgzhyhyx.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/j/k/z/-original-imagvpaknd8qhfhg.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/g/v/c/-original-imagvpakdzgyhmaz.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/p/m/h/-original-imagvpakgxzbjfvh.jpeg"
        )
    },
    @{
        name = "JBL Partybox 310"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/mobile-tablet-speaker/d/4/d/partybox-310-jbl-original-imagt4tzbyekfzjf.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/mobile-tablet-speaker/d/4/d/partybox-310-jbl-original-imagt4tzbyekfzjf.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/mobile-tablet-speaker/k/h/p/partybox-310-jbl-original-imagt4tzq4rcxftz.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/mobile-tablet-speaker/s/k/d/partybox-310-jbl-original-imagt4tzgepcqhjq.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/mobile-tablet-speaker/j/y/l/partybox-310-jbl-original-imagt4tzd9tfzhpx.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/mobile-tablet-speaker/c/4/8/partybox-310-jbl-original-imagt4tzhzhqjpgr.jpeg"
        )
    },
    @{
        name = "Mixer Grinder"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/mixer-grinder-juicer/p/q/b/neo-pro-mx-261-maharaja-whiteline-original-imahfpkghjxzqzuu.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/mixer-grinder-juicer/p/q/b/neo-pro-mx-261-maharaja-whiteline-original-imahfpkghjxzqzuu.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/mixer-grinder-juicer/t/v/m/neo-pro-mx-261-maharaja-whiteline-original-imahfpkggyhggqfh.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/mixer-grinder-juicer/b/k/n/neo-pro-mx-261-maharaja-whiteline-original-imahfpkghzagsz6z.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/mixer-grinder-juicer/x/r/i/neo-pro-mx-261-maharaja-whiteline-original-imahfpkgafjkmhkk.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/mixer-grinder-juicer/z/s/e/neo-pro-mx-261-maharaja-whiteline-original-imahfpkgfsv24fzg.jpeg"
        )
    },
    @{
        name = "Gas Stove"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/gas-stove/q/l/n/manual-brass-3-bp-jio-khaitan-original-imah4gj6zsmdhypm.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/gas-stove/q/l/n/manual-brass-3-bp-jio-khaitan-original-imah4gj6zsmdhypm.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/gas-stove/z/k/v/manual-brass-3-bp-jio-khaitan-original-imah4gj6ghczypwf.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/gas-stove/n/x/v/manual-brass-3-bp-jio-khaitan-original-imah4gj6cszrzyg8.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/gas-stove/q/e/v/manual-brass-3-bp-jio-khaitan-original-imah4gj6yrzjgnx9.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/gas-stove/v/d/j/manual-brass-3-bp-jio-khaitan-original-imah4gj6wzkh9prh.jpeg"
        )
    },
    @{
        name = "OnePlus Bullets Z2"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/g/g/u/bullets-wireless-z2-anc-oneplus-original-imagxyef6svqcazc.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/g/g/u/bullets-wireless-z2-anc-oneplus-original-imagxyef6svqcazc.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/w/z/d/bullets-wireless-z2-anc-oneplus-original-imagxyefwqw2fyhg.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/r/c/j/bullets-wireless-z2-anc-oneplus-original-imagxyefyqgqzgyf.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/x/a/f/bullets-wireless-z2-anc-oneplus-original-imagxyef2zfgdzhk.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/v/p/h/bullets-wireless-z2-anc-oneplus-original-imagxyefq2pgmhzz.jpeg"
        )
    },
    @{
        name = "Sony HT-S20R"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/sound-bar/h/k/h/ht-s20r-sony-original-imah2rjmqhkyzfzc.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/sound-bar/h/k/h/ht-s20r-sony-original-imah2rjmqhkyzfzc.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/sound-bar/8/c/6/ht-s20r-sony-original-imah2rjmghjpg6rh.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/sound-bar/z/h/a/ht-s20r-sony-original-imah2rjmzkdujhgz.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/sound-bar/d/h/w/ht-s20r-sony-original-imah2rjmhxhjggyf.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/speaker/sound-bar/a/w/b/ht-s20r-sony-original-imah2rjmfdzghqth.jpeg"
        )
    },
    @{
        name = "Mi Power Bank"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/power-bank/g/f/c/pb2022zin-18-mi-original-imagmh9p8jdzdfsa.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/power-bank/g/f/c/pb2022zin-18-mi-original-imagmh9p8jdzdfsa.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/power-bank/w/x/q/pb2022zin-18-mi-original-imagmh9pwfhzufyg.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/power-bank/a/m/k/pb2022zin-18-mi-original-imagmh9pgzhmdzph.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/power-bank/v/f/a/pb2022zin-18-mi-original-imagmh9pxzmbqgn2.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/power-bank/d/h/y/pb2022zin-18-mi-original-imagmh9pfzfgfhqg.jpeg"
        )
    },
    @{
        name = "Sony WH-1000XM4"
        main = "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/d/u/d/wh-1000xm4-sony-original-imahfqwgg6kbq7qg.jpeg"
        images = @(
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/d/u/d/wh-1000xm4-sony-original-imahfqwgg6kbq7qg.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/s/f/l/wh-1000xm4-sony-original-imahfqwggdhqczq8.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/b/p/u/wh-1000xm4-sony-original-imahfqwgkgqtshgz.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/h/f/z/wh-1000xm4-sony-original-imahfqwghbzgecvq.jpeg",
            "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/e/a/a/wh-1000xm4-sony-original-imahfqwgx2d6hyra.jpeg"
        )
    }
)

$downloaded = 0
$failed = 0

Write-Host "`nDownloading images for $($products.Count) products..." -ForegroundColor Yellow

for ($i = 0; $i -lt $products.Count; $i++) {
    $productNum = $i + 1
    $product = $products[$i]
    
    Write-Host "`nProduct $productNum : $($product.name)" -ForegroundColor Cyan
    
    # Download main product image
    try {
        $mainImagePath = Join-Path $imageDir "product-$productNum.jpg"
        Invoke-WebRequest -Uri $product.main -OutFile $mainImagePath -TimeoutSec 15 -UseBasicParsing
        Write-Host "  ✓ Main image downloaded" -ForegroundColor Green
        $downloaded++
    } catch {
        Write-Host "  ✗ Main image failed: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
    
    # Download gallery images
    for ($j = 0; $j -lt $product.images.Count; $j++) {
        $imgNum = $j + 1
        try {
            $galleryPath = Join-Path $productsDir "product-$productNum-img-$imgNum.jpg"
            Invoke-WebRequest -Uri $product.images[$j] -OutFile $galleryPath -TimeoutSec 15 -UseBasicParsing
            Write-Host "  ✓ Gallery image $imgNum downloaded" -ForegroundColor Green
            $downloaded++
        } catch {
            Write-Host "  ✗ Gallery image $imgNum failed" -ForegroundColor Red
            $failed++
        }
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Download Complete!" -ForegroundColor Green
Write-Host "Successfully downloaded: $downloaded images" -ForegroundColor Green
Write-Host "Failed: $failed images" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
