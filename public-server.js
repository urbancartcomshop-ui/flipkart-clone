const express = require('express');
const http = require('http');
const path = require('path');

// Public Server Configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Allow CORS for worldwide access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cache-Control', 'no-cache');
    next();
});

// Load products
let products = [];
try {
    const productsPath = path.join(__dirname, 'public', 'products.json');
    products = require(productsPath);
} catch (err) {
    console.error('Failed to load products.json');
    products = [];
}

// PUBLIC ROUTES

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/product', (req, res) => {
    const productId = req.query.id;
    if (!productId) {
        return res.status(400).send('Product ID required');
    }
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// API ENDPOINTS - WORLD ACCESSIBLE

app.get('/api/products', (req, res) => {
    res.json({
        status: 'success',
        count: products.length,
        products: products,
        server: 'Flipkart Clone - Africa (South Africa)',
        market: 'India',
        currency: 'INR',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
        status: 'success',
        product: product,
        server: 'Flipkart Clone - Africa (South Africa)',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json({
        status: 'success',
        categories: categories,
        count: categories.length
    });
});

app.get('/api/categories/:category', (req, res) => {
    const categoryProducts = products.filter(p => p.category.toLowerCase() === req.params.category.toLowerCase());
    res.json({
        status: 'success',
        category: req.params.category,
        count: categoryProducts.length,
        products: categoryProducts
    });
});

app.get('/api/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    if (!query) {
        return res.json({ status: 'success', results: [], message: 'No search query provided' });
    }
    
    const results = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    
    res.json({
        status: 'success',
        query: query,
        count: results.length,
        results: results
    });
});

app.get('/api/featured', (req, res) => {
    const featured = products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
    
    res.json({
        status: 'success',
        count: featured.length,
        featured: featured
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        status: 'success',
        totalProducts: products.length,
        categories: [...new Set(products.map(p => p.category))].length,
        averagePrice: (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2),
        averageRating: (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(2),
        priceRange: {
            min: Math.min(...products.map(p => p.price)),
            max: Math.max(...products.map(p => p.price))
        },
        server: {
            region: 'Africa (South Africa - Johannesburg)',
            coordinates: '-26.2023° S, 28.0436° E',
            timezone: 'SAST (UTC+2)',
            market: 'India',
            currency: 'INR'
        },
        timestamp: new Date().toISOString()
    });
});

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        server: 'Flipkart Clone Public Server',
        region: 'Africa (South Africa - Johannesburg)',
        market: 'India',
        accessibility: 'Public - Worldwide'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║       FLIPKART CLONE - PUBLIC WORLD SERVER RUNNING         ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`🌐 Local access: http://localhost:${PORT}`);
    console.log(`🌍 Public access: http://<your-ip>:${PORT}`);
    console.log('');
    console.log('📊 API Endpoints:');
    console.log(`   http://localhost:${PORT}/api/products - All products`);
    console.log(`   http://localhost:${PORT}/api/products/:id - Single product`);
    console.log(`   http://localhost:${PORT}/api/search?q=query - Search`);
    console.log(`   http://localhost:${PORT}/api/categories - All categories`);
    console.log(`   http://localhost:${PORT}/api/featured - Top 10 products`);
    console.log(`   http://localhost:${PORT}/api/stats - Statistics`);
    console.log(`   http://localhost:${PORT}/health - Health check`);
    console.log('');
    console.log('🛍️  Site Features:');
    console.log('   ✅ 32 Products from India');
    console.log('   ✅ Indian Customer Reviews');
    console.log('   ✅ UPI Payment Integration');
    console.log('   ✅ Mobile Responsive Design');
    console.log('   ✅ Full Search & Filters');
    console.log('');
    console.log('📍 Server Location: Africa (South Africa - Johannesburg)');
    console.log('🇮🇳 Optimized For: India');
    console.log('💰 Currency: INR (₹)');
    console.log('');
    console.log('🔗 To make it PUBLICLY accessible:');
    console.log('   1. Find your public IP address');
    console.log('   2. Share: http://<your-public-ip>:' + PORT);
    console.log('   3. Anyone can access from their browser!');
    console.log('');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
});

server.on('error', (err) => {
    console.error('Server error:', err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Server shutting down...');
    server.close();
});
