const express = require('express');
const path = require('path');
const app = express();

// Serve static files from Flipkart directory
app.use(express.static(path.join(__dirname, 'Flipkart')));

// Serve images
app.use('/images', express.static(path.join(__dirname, 'Flipkart/images')));

// Serve data
app.use('/data', express.static(path.join(__dirname, 'Flipkart/data')));

// API routes
app.get('/api/products', (req, res) => {
    res.json(require('./Flipkart/products.json'));
});

// Handle SPA routing - serve index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Flipkart', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving files from: ${path.join(__dirname, 'Flipkart')}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
