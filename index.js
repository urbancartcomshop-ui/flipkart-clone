/**
 * Flipkart Clone - Main Express Server
 * Hosted from Africa (South Africa Region)
 * Features: Complete e-commerce platform with products, cart, checkout
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const REGION = 'Africa (South Africa - Johannesburg)';

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// HELPER FUNCTIONS
// ============================================

// Load products data
function getProducts() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'public', 'products.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading products:', err);
    return [];
  }
}

// Get categories from products
function getCategories() {
  const products = getProducts();
  const categories = [...new Set(products.map(p => p.category))];
  return categories.sort();
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    region: REGION,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API ENDPOINTS
// ============================================

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search, sort, limit } = req.query;
  let products = getProducts();

  // Filter by category
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // Search
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    products.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  // Limit
  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    count: products.length,
    region: REGION,
    data: products
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const products = getProducts();
  const product = products.find(p => p.id === id);

  if (product) {
    res.json({
      success: true,
      region: REGION,
      data: product
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Product not found',
      region: REGION
    });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = getCategories();
  res.json({
    success: true,
    count: categories.length,
    region: REGION,
    data: categories
  });
});

// Get products by category
app.get('/api/categories/:category', (req, res) => {
  const { category } = req.params;
  const products = getProducts().filter(p => p.category === category);

  res.json({
    success: true,
    category,
    count: products.length,
    region: REGION,
    data: products
  });
});

// Get featured products
app.get('/api/featured', (req, res) => {
  const products = getProducts();
  const featured = products
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  res.json({
    success: true,
    count: featured.length,
    region: REGION,
    data: featured
  });
});

// Search products
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({
      success: false,
      error: 'Search query required',
      region: REGION
    });
  }

  const searchLower = q.toLowerCase();
  const products = getProducts().filter(p =>
    p.name.toLowerCase().includes(searchLower) ||
    (p.description && p.description.toLowerCase().includes(searchLower)) ||
    (p.category && p.category.toLowerCase().includes(searchLower))
  );

  res.json({
    success: true,
    query: q,
    count: products.length,
    region: REGION,
    data: products
  });
});

// Get site stats
app.get('/api/stats', (req, res) => {
  const products = getProducts();
  const categories = getCategories();

  res.json({
    success: true,
    region: REGION,
    stats: {
      totalProducts: products.length,
      totalCategories: categories.length,
      categories: categories,
      averageRating: (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(2),
      priceRange: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    }
  });
});

// ============================================
// HTML ROUTES
// ============================================

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/category/:name', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

// ============================================
// SEO ROUTES
// ============================================

app.get('/sitemap.xml', (req, res) => {
  res.type('text/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║          🛍️  FLIPKART CLONE - SERVER STARTED              ║
╚════════════════════════════════════════════════════════════╝

📍 Server Region: ${REGION}
🌐 Local URL: http://localhost:${PORT}
🌍 Production URL: Deploy to Vercel/Render
📊 API Base: http://localhost:${PORT}/api

✅ Available Routes:

HOME & PAGES:
  GET  /                    Homepage
  GET  /product/:id         Product details
  GET  /cart                Shopping cart
  GET  /checkout            Checkout page
  GET  /category/:name      Category page

API ENDPOINTS:
  GET  /api/products                All products
  GET  /api/products/:id            Single product
  GET  /api/categories              All categories
  GET  /api/categories/:category    Products in category
  GET  /api/featured                Featured products
  GET  /api/search?q=query         Search products
  GET  /api/stats                   Site statistics

SEO:
  GET  /sitemap.xml         XML sitemap
  GET  /robots.txt          Robots file
  GET  /404.html            Error page

HEALTH:
  GET  /health              Health check

Ready to serve! 🚀
  `);
});

module.exports = app;
