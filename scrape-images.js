const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const imageDir = path.join(__dirname, 'Flipkart', 'images', 'products');

// Create images directory if it doesn't exist
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function scrapeImages() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to season-maniya.top...');
  
  try {
    await page.goto('https://season-maniya.top/fk/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for products to load
    await page.waitForSelector('a[href*="/ProductManager/"]', { timeout: 10000 });
    
    console.log('Extracting product links...');
    
    // Get all product links
    const productLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*="/ProductManager/"]'))
        .map(a => a.href)
        .filter((href, index, arr) => arr.indexOf(href) === index); // Remove duplicates
    });
    
    console.log(`Found ${productLinks.length} products. Scraping details from each...`);
    
    const allProductData = [];
    const downloadedImages = [];
    let count = 0;
    
    for (const productLink of productLinks) {
      try {
        count++;
        console.log(`\n[${count}/${productLinks.length}] Visiting ${productLink}`);
        
        await page.goto(productLink, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extract all product details
        const productData = await page.evaluate(() => {
          const data = {
            name: '',
            price: '',
            originalPrice: '',
            discount: '',
            rating: '',
            reviews: '',
            description: '',
            images: [],
            allText: ''
          };
          
          // Get all text on page
          data.allText = document.body.innerText;
          
          // Try multiple selectors for different fields
          data.name = document.querySelector('h1, h2, [class*="title"], [class*="name"]')?.innerText || '';
          data.price = document.querySelector('[class*="price"], [class*="cost"]')?.innerText || '';
          data.originalPrice = document.querySelector('[class*="original"], [class*="mrp"]')?.innerText || '';
          data.discount = document.querySelector('[class*="discount"], [class*="off"]')?.innerText || '';
          data.rating = document.querySelector('[class*="rating"], [class*="star"]')?.innerText || '';
          data.reviews = document.querySelector('[class*="review"]')?.innerText || '';
          
          // Get description
          data.description = document.querySelector('[class*="desc"], [class*="description"]')?.innerText || '';
          
          // Get all images
          const images = document.querySelectorAll('img');
          images.forEach((img, idx) => {
            if (img.src && img.src.startsWith('http')) {
              data.images.push({
                src: img.src,
                alt: img.alt || `image-${idx}`
              });
            }
          });
          
          return data;
        });
        
        console.log(`  Name: ${productData.name.substring(0, 60)}`);
        console.log(`  Price: ${productData.price.substring(0, 40)}`);
        console.log(`  Found ${productData.images.length} images`);
        
        // Download images
        for (let i = 0; i < productData.images.length; i++) {
          const imgData = productData.images[i];
          try {
            const filename = `product-${count}-img-${i + 1}.jpg`;
            const filepath = path.join(imageDir, filename);
            
            await downloadImage(imgData.src, filepath);
            console.log(`    ✓ Downloaded image: ${filename}`);
            downloadedImages.push({ productId: count, filename, url: imgData.src });
          } catch (imgErr) {
            console.log(`    ✗ Failed to download: ${imgData.src.substring(0, 50)}`);
          }
        }
        
        allProductData.push({
          id: count,
          link: productLink,
          ...productData
        });
        
      } catch (err) {
        console.error(`  ✗ Error processing product: ${err.message}`);
      }
    }
    
    await browser.close();
    
    console.log(`\n✓ Downloaded ${downloadedImages.length} images from ${allProductData.length} products`);
    
    // Save all product data
    const dataPath = path.join(__dirname, 'scraped-products.json');
    fs.writeFileSync(dataPath, JSON.stringify(allProductData, null, 2));
    console.log(`✓ Product data saved to scraped-products.json`);
    
    // Save image mapping
    const mappingPath = path.join(__dirname, 'image-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(downloadedImages, null, 2));
    console.log(`✓ Image mapping saved to image-mapping.json`);
    
  } catch (err) {
    console.error('Error:', err);
    await browser.close();
    process.exit(1);
  }
}

scrapeImages();
