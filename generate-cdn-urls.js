const fs = require('fs');
const path = require('path');

// Create CDN URLs using jsDelivr (serves from GitHub)
// Format: https://cdn.jsdelivr.net/gh/YOUR_USERNAME/flipkart-clone@main/path/to/image

const githubUser = 'YOUR_USERNAME';
const repo = 'flipkart-clone';
const branch = 'main';

// Read products
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// Update image paths to use jsdelivr CDN
const updatedProducts = products.map(product => {
    return {
        ...product,
        image: `https://cdn.jsdelivr.net/gh/${githubUser}/${repo}@${branch}/${product.image}`,
        images: product.images.map(img => 
            `https://cdn.jsdelivr.net/gh/${githubUser}/${repo}@${branch}/${img}`
        )
    };
});

// Save updated products
fs.writeFileSync('data/products-cdn.json', JSON.stringify(updatedProducts, null, 2));
console.log('✓ Created data/products-cdn.json with CDN URLs');
console.log('Sample URL:', updatedProducts[0].image);
