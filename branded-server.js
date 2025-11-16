const express = require('express');
const http = require('http');
const path = require('path');

// Branded URL Router
const app = express();
const PORT = process.env.PORT || 80; // Port 80 for prettier URLs

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS for worldwide access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Load products
let products = [];
try {
    const productsPath = path.join(__dirname, 'public', 'products.json');
    products = require(productsPath);
} catch (err) {
    console.error('Failed to load products.json');
}

// ========== BRANDED REDIRECT ROUTES ==========

// plipkart.africa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// flipko.store
app.get('/store', (req, res) => {
    res.redirect('/');
});

// flipko-store (hyphen version)
app.get('/flipko-store', (req, res) => {
    res.redirect('/');
});

// africa-flipkart
app.get('/africa', (req, res) => {
    res.redirect('/');
});

// india-flipkart
app.get('/india', (req, res) => {
    res.redirect('/');
});

// ========== PRODUCT ROUTES ==========

app.get('/product', (req, res) => {
    const productId = req.query.id;
    if (!productId) {
        return res.status(400).send('Product ID required');
    }
    res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

// ========== API ENDPOINTS ==========

app.get('/api/products', (req, res) => {
    res.json({
        status: 'success',
        count: products.length,
        products: products,
        server: 'Flipkart Africa India Store',
        domain: 'plipkart.africa / flipko.store',
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
        server: 'Flipkart Africa India',
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
        return res.json({ status: 'success', results: [], message: 'No search query' });
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
            market: 'India',
            currency: 'INR',
            brands: ['plipkart', 'flipko', 'flipkart-africa', 'flipkart-india']
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        server: 'Flipkart Africa India - Branded Store',
        brands: ['plipkart.africa', 'flipko.store'],
        timestamp: new Date().toISOString()
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Page not found', status: 404 });
});

// Start server
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     FLIPKART AFRICA INDIA - BRANDED STORE RUNNING          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('🌐 Branded Domains (Point to your IP):');
    console.log('   • plipkart.africa');
    console.log('   • flipko.store');
    console.log('   • flipkart-africa.com');
    console.log('   • flipkart-india.com');
    console.log('');
    console.log('📍 Server IP: 223.185.58.231');
    console.log('🔗 Current URLs:');
    console.log('   • http://223.185.58.231:3000');
    console.log('   • http://223.185.58.231 (if port 80 available)');
    console.log('');
    console.log('✨ Features:');
    console.log('   ✅ 32 Products from India');
    console.log('   ✅ Indian Reviews & UPI Payment');
    console.log('   ✅ Mobile Responsive Design');
    console.log('   ✅ Complete E-commerce API');
    console.log('');
    console.log('📍 Server Location: Africa (South Africa)');
    console.log('🇮🇳 Market: India | 💰 Currency: INR (₹)');
    console.log('');
});

server.on('error', (err) => {
    if (err.code === 'EACCES' && PORT === 80) {
        console.log('Port 80 requires admin. Using port 3000 instead...');
        const server2 = http.createServer(app);
        server2.listen(3000, '0.0.0.0', () => {
            console.log('Server running on port 3000: http://223.185.58.231:3000');
        });
    } else {
        console.error('Server error:', err);
    }
});
