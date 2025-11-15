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
      fs.unlink(filepath, () => {}); 
      reject(err);
    });
  });
}

async function scrapeAllDetails() {
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
    
    console.log(`Found ${productLinks.length} products. Scraping all details from each...\n`);
    
    const allProductData = [];
    const downloadedImages = [];
    let count = 0;
    
    for (const productLink of productLinks) {
      try {
        count++;
        console.log(`[${count}/${productLinks.length}] Scraping: ${productLink}`);
        
        await page.goto(productLink, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Extract ALL product details
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
            fullPageHTML: ''
          };
          
          // Get full page HTML
          data.fullPageHTML = document.documentElement.outerHTML;
          
          // Extract all text
          const allText = document.body.innerText;
          
          // Try to parse price info from text
          const priceMatch = allText.match(/₹[\s]*([0-9,]+)/g);
          if (priceMatch && priceMatch.length > 0) {
            data.originalPrice = priceMatch[0];
            if (priceMatch.length > 1) data.price = priceMatch[1];
          }
          
          // Get discount
          const discountMatch = allText.match(/([0-9]+)%\s*(?:off|OFF)/i);
          if (discountMatch) data.discount = discountMatch[1] + '%';
          
          // Get rating
          const ratingMatch = allText.match(/([0-9.]+)\s*⭐|rating[:\s]*([0-9.]+)/i);
          if (ratingMatch) data.rating = ratingMatch[1] || ratingMatch[2];
          
          // Get review count
          const reviewMatch = allText.match(/([0-9,]+)\s*(?:review|rating|Ratings)/i);
          if (reviewMatch) data.reviews = reviewMatch[1];
          
          // Get title/name (longest heading or title tag)
          let titleElem = document.querySelector('h1') || document.querySelector('h2') || document.querySelector('title');
          if (titleElem) data.name = titleElem.innerText.trim();
          
          // Get description
          const descElems = document.querySelectorAll('p, [class*="desc"], [class*="detail"]');
          for (let elem of descElems) {
            let text = elem.innerText.trim();
            if (text.length > 50 && text.length < 500) {
              data.description = text;
              break;
            }
          }
          
          // Get ALL images on the page
          const images = document.querySelectorAll('img');
          images.forEach((img, idx) => {
            if (img.src && (img.src.startsWith('http') || img.src.includes('data:'))) {
              data.images.push({
                src: img.src,
                alt: img.alt || `image-${idx}`,
                width: img.width,
                height: img.height
              });
            }
          });
          
          return data;
        });
        
        console.log(`  Name: ${productData.name.substring(0, 70)}`);
        console.log(`  Price: ${productData.price} | Original: ${productData.originalPrice}`);
        console.log(`  Discount: ${productData.discount} | Rating: ${productData.rating} | Reviews: ${productData.reviews}`);
        console.log(`  Found ${productData.images.length} images on page`);
        
        // Download all images
        let imgCount = 0;
        for (let i = 0; i < productData.images.length && i < 5; i++) { // Limit to 5 images per product
          const imgData = productData.images[i];
          try {
            // Skip tiny images and tracking pixels
            if (imgData.width && imgData.width < 50) continue;
            
            const filename = `product-${count}-img-${i + 1}.jpg`;
            const filepath = path.join(imageDir, filename);
            
            console.log(`    Downloading: ${filename} from ${imgData.src.substring(0, 50)}...`);
            await downloadImage(imgData.src, filepath);
            
            downloadedImages.push({
              productId: count,
              filename,
              url: imgData.src,
              alt: imgData.alt
            });
            imgCount++;
            console.log(`      ✓ Success`);
          } catch (imgErr) {
            console.log(`      ✗ Failed: ${imgErr.message.substring(0, 40)}`);
          }
        }
        
        // Store product data
        allProductData.push({
          id: count,
          link: productLink,
          name: productData.name,
          price: productData.price,
          originalPrice: productData.originalPrice,
          discount: productData.discount,
          rating: productData.rating,
          reviews: productData.reviews,
          description: productData.description,
          imageCount: imgCount,
          downloadedImages: downloadedImages.filter(img => img.productId === count).map(img => img.filename)
        });
        
        console.log();
        
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`);
      }
    }
    
    await browser.close();
    
    console.log(`\n========================================`);
    console.log(`✓ Completed scraping ${allProductData.length} products`);
    console.log(`✓ Downloaded ${downloadedImages.length} product images`);
    console.log(`========================================\n`);
    
    // Save all product data
    const dataPath = path.join(__dirname, 'scraped-products-full.json');
    fs.writeFileSync(dataPath, JSON.stringify(allProductData, null, 2));
    console.log(`✓ Full product data saved to: scraped-products-full.json`);
    
    // Save image mapping
    const mappingPath = path.join(__dirname, 'image-mapping-full.json');
    fs.writeFileSync(mappingPath, JSON.stringify(downloadedImages, null, 2));
    console.log(`✓ Image mapping saved to: image-mapping-full.json`);
    
    console.log(`\n✓ Images saved to: Flipkart/images/products/`);
    
  } catch (err) {
    console.error('Fatal error:', err);
    await browser.close();
    process.exit(1);
  }
}

scrapeAllDetails();
