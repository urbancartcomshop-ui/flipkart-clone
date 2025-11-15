const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const FormData = require('form-data');

// Array to store image URLs
const imageMapping = {};

// Function to upload image to ImgBB
async function uploadToImgBB(imagePath, productId, imgNum) {
    return new Promise((resolve, reject) => {
        const imageBuffer = fs.readFileSync(imagePath);
        const form = new FormData();
        form.append('image', imageBuffer, path.basename(imagePath));

        const options = {
            hostname: 'api.imgbb.com',
            port: 443,
            path: '/1/upload?key=00000000000000000000000000000000', // ImgBB free tier (replace with real key if needed)
            method: 'POST',
            headers: form.getHeaders()
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.success) {
                        const url = response.data.display_url;
                        const key = `product-${productId}-img-${imgNum}`;
                        imageMapping[key] = url;
                        console.log(`✓ ${key}: ${url}`);
                        resolve(url);
                    } else {
                        reject(new Error('Upload failed: ' + response.error.message));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        form.pipe(req);
    });
}

// Upload images sequentially
async function uploadAllImages() {
    const imagesDir = path.join(__dirname, 'Flipkart/images/products');
    const files = fs.readdirSync(imagesDir).sort();
    
    console.log(`Found ${files.length} images to upload...\n`);
    
    let uploaded = 0;
    for (let i = 0; i < Math.min(files.length, 10); i++) { // Upload first 10 for testing
        const file = files[i];
        const match = file.match(/product-(\d+)-img-(\d+)/);
        if (match) {
            const productId = match[1];
            const imgNum = match[2];
            const imagePath = path.join(imagesDir, file);
            
            try {
                console.log(`[${i + 1}/${Math.min(files.length, 10)}] Uploading ${file}...`);
                await uploadToImgBB(imagePath, productId, imgNum);
                uploaded++;
            } catch (err) {
                console.error(`✗ Failed to upload ${file}: ${err.message}`);
            }
        }
    }
    
    console.log(`\n✓ Uploaded ${uploaded} images`);
    
    // Save mapping
    fs.writeFileSync('cdn-image-mapping.json', JSON.stringify(imageMapping, null, 2));
    console.log('Image mapping saved to cdn-image-mapping.json');
}

uploadAllImages().catch(console.error);
