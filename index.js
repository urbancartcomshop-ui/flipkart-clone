/**
 * Flipkart Clone - Express Server
 * ✅ HOSTED FROM: Africa (South Africa - Johannesburg)
 * ✅ OPTIMIZED FOR: India
 * Features: Complete e-commerce platform with products, cart, checkout
 * Updated: Nov 16, 2025 - Fixed homepage with no add to cart button
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

// Initialize Stripe with environment variable
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const app = express();
const PORT = process.env.PORT || 3000;
const REGION = 'Africa (South Africa - Johannesburg)';
const TARGET_MARKET = 'India';

// ============================================
// MIDDLEWARE
// ============================================
// Enable CORS for all origins - fully public
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Add India-specific headers for optimization
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Server-Region', REGION);
  res.setHeader('X-Target-Market', TARGET_MARKET);
  res.setHeader('X-Powered-By', 'Flipkart-Clone-Africa');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files publicly with no restrictions
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

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
    server: {
      region: REGION,
      host: 'Africa (South Africa - Johannesburg)',
      targetMarket: TARGET_MARKET
    },
    location: 'India',
    timestamp: new Date().toISOString(),
    message: '✅ Server is running in Africa, optimized for India users'
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
    targetMarket: TARGET_MARKET,
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

// India-specific endpoint
app.get('/api/india-info', (req, res) => {
  res.json({
    success: true,
    server: {
      host: REGION,
      region: 'South Africa - Johannesburg',
      coordinates: {
        latitude: -26.2023,
        longitude: 28.0436
      }
    },
    service: {
      market: TARGET_MARKET,
      country: 'India',
      currency: 'INR (₹)',
      language: 'English, Hindi',
      timezone: 'IST (UTC+5:30)'
    },
    features: {
      products: getProducts().length,
      reviews: 'Indian customer reviews (verified)',
      payment: 'UPI (Primary), Card, Net Banking, Wallet',
      delivery: 'Pan India delivery support',
      support: 'Hindi & English support available'
    },
    message: '🇿🇦 Hosted in South Africa | 🇮🇳 Optimized for India'
  });
});

// ============================================
// HTML ROUTES
// ============================================

// SERVER-SIDE RENDERED HOMEPAGE - NO JAVASCRIPT NEEDED!
app.get('/', (req, res) => {
  const products = getProducts();
  const bestSellers = products.slice(0, 12);
  const topRated = products.filter(p => p.rating >= 4.5).slice(0, 12);
  
  // Generate product cards HTML
  const generateProductCard = (product) => `
    <a href="/product-details.html?id=${product.id}" class="product-card" style="text-decoration: none; color: inherit;">
      <div class="product-image">
        <img src="/${product.image}" alt="${product.name}" loading="lazy" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23f5f5f5%22 width=%22150%22 height=%22150%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2212%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23999%22%3EProduct%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="rating-star">★</span>
          <span>${product.rating} (${product.reviews})</span>
        </div>
        <div class="product-prices">
          <span class="price">₹${product.price}</span>
          <span class="original-price">₹${product.original_price}</span>
          <span class="discount">${product.discount}% off</span>
        </div>
        <div class="product-badge">View Details →</div>
      </div>
    </a>
  `;
  
  // Read the HTML template
  let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  
  // Replace loading placeholder with actual products
  const bestSellersHTML = bestSellers.map(generateProductCard).join('');
  const topRatedHTML = topRated.map(generateProductCard).join('');
  
  html = html.replace(
    '<div class="products-grid" id="bestSellersGrid">',
    `<div class="products-grid" id="bestSellersGrid" data-ssr="true">`
  );
  
  html = html.replace(
    '<div class="loading">Loading products...</div>',
    bestSellersHTML
  );
  
  html = html.replace(
    /<div class="products-grid" id="topRatedGrid">\s*<div class="loading">Loading products...<\/div>/,
    `<div class="products-grid" id="topRatedGrid" data-ssr="true">${topRatedHTML}`
  );
  
  // Remove or comment out the JavaScript that tries to fetch products
  html = html.replace(
    '// Initialize when DOM is ready',
    `// SERVER-SIDE RENDERED - Products already loaded!
    console.log('[FLIPKART] Server-side rendering active - ${products.length} products loaded');
    // Initialize when DOM is ready (DISABLED - using SSR)`
  );
  
  html = html.replace(
    'fetchProducts();',
    '// fetchProducts(); // DISABLED - using server-side rendering'
  );
  
  res.send(html);
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
// PAYMENT GATEWAY - STRIPE INTEGRATION
// ============================================

// Create payment intent for credit card payments
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'INR', description, customerEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise for INR
      currency: currency.toLowerCase(),
      description: description || 'Flipkart Purchase',
      receipt_email: customerEmail,
      metadata: {
        source: 'flipkart-clone',
        market: 'India',
        region: 'Africa'
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create payment intent'
    });
  }
});

// Confirm payment and process order
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderId, items, customerEmail } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID required' });
    }

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment successful - store order
      const order = {
        orderId: orderId || `ORDER-${Date.now()}`,
        paymentIntentId: paymentIntentId,
        amount: paymentIntent.amount / 100, // Convert back to rupees
        currency: paymentIntent.currency.toUpperCase(),
        items: items || [],
        customerEmail: customerEmail,
        status: 'paid',
        paymentMethod: 'credit_card',
        paymentDate: new Date().toISOString(),
        receiptUrl: paymentIntent.charges.data[0]?.receipt_url || null
      };

      // Log order (in production, save to database)
      console.log('✅ Order Confirmed:', order);

      res.status(200).json({
        success: true,
        message: 'Payment successful! Order confirmed.',
        order: order,
        receipt: paymentIntent.charges.data[0]?.receipt_url
      });
    } else if (paymentIntent.status === 'processing') {
      res.status(200).json({
        success: false,
        message: 'Payment is processing. Please wait.',
        status: 'processing'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to confirm payment'
    });
  }
});

// Get publishable key for Stripe.js frontend
app.get('/api/stripe-key', (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  });
});

// Webhook to handle Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (!webhookSecret) {
      console.log('⚠️ Webhook secret not configured');
      return res.sendStatus(200);
    }

    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id);
        break;
      case 'charge.refunded':
        console.log('💰 Refund processed:', event.data.object.id);
        break;
      default:
        console.log('ℹ️ Unhandled event type:', event.type);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(400);
  }
});

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
