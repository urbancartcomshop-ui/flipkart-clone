const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Read products from JSON
const products = JSON.parse(fs.readFileSync('./public/products.json', 'utf8'));

// High-quality product images from reliable CDN sources
const productImages = {
    1: 'https://m.media-amazon.com/images/I/51ws0E8cnbL._SL1500_.jpg', // OnePlus Buds Pro 2
    2: 'https://m.media-amazon.com/images/I/61V9APrGcIL._SL1500_.jpg', // JBL Wave Beam
    3: 'https://m.media-amazon.com/images/I/61ysOi+MFML._SL1500_.jpg', // Noise Colorfit Icon 2
    4: 'https://m.media-amazon.com/images/I/81s5bGXzMUL._SL1500_.jpg', // JBL Partybox 310
    5: 'https://m.media-amazon.com/images/I/71VcAoN0+oL._SL1500_.jpg', // MAHARAJA WHITELINE Mixer
    6: 'https://m.media-amazon.com/images/I/71iRRlE8HiL._SL1500_.jpg', // Khaitan Gas Stove
    7: 'https://m.media-amazon.com/images/I/61NezHEIzVL._SL1500_.jpg', // OnePlus Bullets Z2
    8: 'https://m.media-amazon.com/images/I/61tnrq06khL._SL1500_.jpg', // SONY HT-S20R
    9: 'https://m.media-amazon.com/images/I/71vWfQKTtmL._SL1500_.jpg', // Mi Power Bank
    10: 'https://m.media-amazon.com/images/I/61lmCYP7JfL._SL1500_.jpg', // SONY WH-1000XM4
    11: 'https://m.media-amazon.com/images/I/71KJlj2AzWL._SL1500_.jpg', // HAVELLS Kettle
    12: 'https://m.media-amazon.com/images/I/71hcWtY7ezL._SL1500_.jpg', // SAMSUNG Microwave
    13: 'https://m.media-amazon.com/images/I/71GyTxNJ0xL._SL1500_.jpg', // BAJAJ Geyser
    14: 'https://m.media-amazon.com/images/I/71MNdZ5b8sL._SL1500_.jpg', // Hindware Cooler
    15: 'https://m.media-amazon.com/images/I/71iiF0g+fAL._SL1500_.jpg', // Crompton Cooler
    16: 'https://m.media-amazon.com/images/I/61Gp-04XRML._SL1500_.jpg', // boAt Soundbar
    17: 'https://m.media-amazon.com/images/I/51mXzKmw2TL._SL1500_.jpg', // Musify Speaker
    18: 'https://m.media-amazon.com/images/I/61w9LN7EpAL._SL1500_.jpg', // realme Buds Air 5
    19: 'https://m.media-amazon.com/images/I/71mXELC9rXL._SL1500_.jpg', // SAFARI Suitcase
    20: 'https://m.media-amazon.com/images/I/61VAXLWJaCL._SL1500_.jpg', // Boult Z40
    21: 'https://m.media-amazon.com/images/I/71d1ytSRbCL._SL1500_.jpg', // Realme Narzo 60 Pro
    22: 'https://m.media-amazon.com/images/I/81MQ-9-d63L._SL1500_.jpg', // Samsung Galaxy A53
    23: 'https://m.media-amazon.com/images/I/81NlCPscBfL._SL1500_.jpg', // LG 32 inch TV
    24: 'https://m.media-amazon.com/images/I/81wKRYELRoL._SL1500_.jpg', // Panasonic 55 inch TV
    25: 'https://m.media-amazon.com/images/I/71zXup1TGPL._SL1500_.jpg', // Philips 42 inch TV
    26: 'https://m.media-amazon.com/images/I/71RQOy3bC2L._SL1500_.jpg', // Godrej Washing Machine
    27: 'https://m.media-amazon.com/images/I/71B7I7xBZoL._SL1500_.jpg', // IFB Washing Machine
    28: 'https://m.media-amazon.com/images/I/61hWm97cXyL._SL1500_.jpg', // Hisense Refrigerator
    29: 'https://m.media-amazon.com/images/I/71Zi0UNw4TL._SL1500_.jpg', // LG Refrigerator
    30: 'https://m.media-amazon.com/images/I/61lU9qt7YUL._SL1500_.jpg', // Voltas AC
    31: 'https://m.media-amazon.com/images/I/61KOkVGuypL._SL1500_.jpg', // Prestige Pressure Cooker
    32: 'https://m.media-amazon.com/images/I/71iA0GzbEyL._SL1500_.jpg'  // Wonderchef Pressure Cooker
};

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);
        
        protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(filepath);
                });
            } else {
                reject(new Error(`Failed to download: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

async function downloadAllImages() {
    const imageDir = path.join(__dirname, 'public', 'images');
    
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    console.log('Starting image downloads...\n');

    for (let i = 1; i <= 32; i++) {
        const filename = `product-${i}.jpg`;
        const filepath = path.join(imageDir, filename);
        
        if (productImages[i]) {
            try {
                console.log(`Downloading product-${i}.jpg...`);
                await downloadImage(productImages[i], filepath);
                console.log(`✓ Downloaded product-${i}.jpg`);
            } catch (error) {
                console.error(`✗ Failed product-${i}.jpg:`, error.message);
            }
        }
    }

    console.log('\n✅ Image download complete!');
    console.log('\nNow updating products.json with correct image paths...');

    // Update products.json with correct image paths
    const updatedProducts = products.map((product, index) => ({
        ...product,
        image: `images/product-${product.id}.jpg`
    }));

    fs.writeFileSync('./public/products.json', JSON.stringify(updatedProducts, null, 4));
    console.log('✅ Products.json updated!');
    console.log('\n🎉 All done! Your site now has real product images.');
}

downloadAllImages().catch(console.error);
