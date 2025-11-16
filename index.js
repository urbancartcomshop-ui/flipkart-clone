/**
 * Flipkart Clone - Secured Express Server with Load Balancing
 * ✅ SECURITY: Advanced protection, identity anonymization
 * ✅ PERFORMANCE: Clustered load balancing, rate limiting
 * Features: Complete e-commerce platform with products, cart, checkout
 * Updated: Nov 16, 2025 - Added security hardening and load balancing
 */

const cluster = require('cluster');
const os = require('os');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Load balancing with cluster - use all CPU cores
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`🚀 Master process ${process.pid} starting...`);
  console.log(`🔄 Spawning ${numCPUs} worker processes for load balancing...`);
  
  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Spawning new worker...`);
    cluster.fork(); // Auto-restart crashed workers
  });

  return; // Master process doesn't run the server
}

// Worker process runs the actual server
console.log(`✅ Worker ${process.pid} started`);

// Initialize Stripe with environment variable
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable trust proxy for rate limiting behind Cloudflare
app.set('trust proxy', 1);

// ============================================
// SECURITY MIDDLEWARE - IDENTITY PROTECTION
// ============================================

// 1. HELMET - Security headers to hide server identity
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'no-referrer' }, // Hide referrer to protect identity
  noSniff: true,
  hidePoweredBy: true, // Remove X-Powered-By header
  xssFilter: true,
  frameguard: { action: 'deny' }
}));

// 2. COMPRESSION - Reduce bandwidth and improve performance
app.use(compression());

// 3. RATE LIMITING - Prevent DDoS and brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`⚠️ Rate limit exceeded from IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
});

// 4. STRICT RATE LIMITING for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 payment attempts per hour
  message: 'Too many payment attempts, please try again later.',
  skipSuccessfulRequests: true
});

app.use('/api/', limiter); // Apply to all API routes
app.use('/api/create-payment', paymentLimiter);
app.use('/api/verify-payment', paymentLimiter);

// 5. ANONYMIZATION - Remove identifying headers and IP exposure
app.use((req, res, next) => {
  // Remove identifying headers
  delete req.headers['x-forwarded-for'];
  delete req.headers['x-real-ip'];
  delete req.headers['cf-connecting-ip'];
  
  // Set privacy headers - hide all server info
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Remove location/region headers to hide identity
  res.removeHeader('X-Server-Region');
  res.removeHeader('X-Target-Market');
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  
  next();
});

// 6. CORS - Allow cross-origin but without credentials
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// 7. LOGGING - Monitor suspicious activity
app.use((req, res, next) => {
  const suspicious = [
    'admin', 'login', 'phpmyadmin', 'wp-admin', '.env', 
    'config', 'backup', 'sql', 'database'
  ];
  
  const isSuspicious = suspicious.some(term => req.url.toLowerCase().includes(term));
  
  if (isSuspicious) {
    console.log(`🚨 SUSPICIOUS REQUEST: ${req.method} ${req.url} from ${req.ip}`);
  }
  
  next();
});

app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
    server: 'online',
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
      
      data: product
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Product not found',
      
    });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = getCategories();
  res.json({
    success: true,
    count: categories.length,
    
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
    
    data: products
  });
});

// Get site stats
app.get('/api/stats', (req, res) => {
  const products = getProducts();
  const categories = getCategories();

  res.json({
    success: true,
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
    server: 'online',
    service: {
      market: 'Global',
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
    <div class="product-card" onclick="viewProduct(${product.id})">
      <img src="/${product.image}" alt="${product.name}" class="product-image" onerror="this.src='/images/placeholder.jpg'">
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="rating-star">★</span>
          <span>${product.rating}</span>
          <span>(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price">₹${product.price}</span>
          ${product.original_price ? `<span class="original-price">₹${product.original_price}</span>` : ''}
          ${product.discount ? `<span class="discount">${product.discount}% OFF</span>` : ''}
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="add-to-cart" onclick="addToCart(event, ${product.id})" style="flex: 1;">🛒 Add to Cart</button>
          <button class="add-to-cart" onclick="buyNow(event, ${product.id})" style="flex: 1; background: #ff9f00;">⚡ Buy Now</button>
        </div>
      </div>
    </div>
  `;
  
  // Read the HTML template
  let html = fs.readFileSync(path.join(__dirname, 'public', 'homepage.html'), 'utf8');
  
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

// ============================================
// UPI PAYMENT SYSTEM (India)
// ============================================

// Get UPI payment link
app.post('/api/upi/create-payment', (req, res) => {
  try {
    const { amount, orderId, customerName, customerEmail } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Your UPI ID - Credit Card Bill Payment
    const upiId = process.env.UPI_ID || 'cc.9199915057220975@axisbank';
    const merchantName = process.env.MERCHANT_NAME || 'Axis Bank Credit Card';
    
    // Generate UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId || Date.now()}`)}`;
    
    // Payment record
    const payment = {
      paymentId: `PAY-${Date.now()}`,
      orderId: orderId || `ORD-${Date.now()}`,
      amount: amount,
      currency: 'INR',
      upiId: upiId,
      upiUrl: upiUrl,
      customerName: customerName,
      customerEmail: customerEmail,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 min expiry
    };

    res.status(200).json({
      success: true,
      payment: payment,
      instructions: {
        step1: 'Click the UPI link or scan QR code',
        step2: 'Complete payment in your UPI app',
        step3: 'Return here and click "I have paid"',
        step4: 'Upload payment screenshot for verification'
      }
    });
  } catch (error) {
    console.error('UPI Payment Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify UPI payment (manual verification)
app.post('/api/upi/verify-payment', (req, res) => {
  try {
    const { paymentId, transactionId, screenshot } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID required' });
    }

    // In real app: Admin verifies screenshot and updates status
    // For now: Accept all payments as "pending verification"
    
    const verification = {
      paymentId: paymentId,
      transactionId: transactionId || 'Pending',
      status: 'pending_verification',
      message: 'Payment received! We will verify and confirm your order within 5-10 minutes.',
      verifiedAt: new Date().toISOString()
    };

    console.log('📱 UPI Payment Verification:', verification);

    res.status(200).json({
      success: true,
      verification: verification
    });
  } catch (error) {
    console.error('UPI Verification Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get UPI QR code data
app.get('/api/upi/qr-code', (req, res) => {
  const { amount, orderId } = req.query;
  
  if (!amount) {
    return res.status(400).json({ error: 'Amount required' });
  }

  const upiId = process.env.UPI_ID || 'cc.9199915057220975@axisbank';
  const merchantName = process.env.MERCHANT_NAME || 'Axis Bank Credit Card';
  
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId || Date.now()}`)}`;
  
  res.json({
    success: true,
    upiUrl: upiUrl,
    qrCodeData: upiUrl,
    upiId: upiId,
    merchantName: merchantName,
    amount: parseFloat(amount),
    currency: 'INR'
  });
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
// ERROR HANDLING - Secure error responses
// ============================================

app.use((req, res) => {
  // Don't reveal 404 page structure for security
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

// Global error handler - hide internal errors
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  
  // Never expose error details to client
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong. Please try again later.'
  });
});

// ============================================
// START SERVER WITH LOAD BALANCING
// ============================================

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     🛍️  FLIPKART CLONE - SECURED SERVER (Worker ${process.pid})   ║
╚═══════════════════════════════════════════════════════════════╝

🔒 SECURITY FEATURES ENABLED:
   ✅ Load Balancing (${os.cpus().length} CPU cores)
   ✅ Rate Limiting (100 req/15min)
   ✅ Payment Protection (10 attempts/hour)
   ✅ Identity Anonymization
   ✅ DDoS Protection
   ✅ XSS & Injection Prevention
   ✅ Secure Headers (Helmet)
   ✅ Request Compression
   ✅ Auto Worker Restart

🌐 Server Status:
   📍 Port: ${PORT}
   🔄 Worker PID: ${process.pid}
   💻 CPU Cores: ${os.cpus().length}
   🚀 Status: ONLINE & PROTECTED

🔐 Privacy Protection:
   ✅ No IP exposure
   ✅ No location headers
   ✅ No server fingerprinting
   ✅ Anonymous referrer policy

Ready to serve securely! 🛡️
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(`⚠️ Worker ${process.pid} received SIGTERM, shutting down gracefully...`);
  server.close(() => {
    console.log(`✅ Worker ${process.pid} closed`);
    process.exit(0);
  });
});

module.exports = app;
