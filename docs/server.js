#!/usr/bin/env node

/**
 * Flipkart Clone - Simple HTTP Server
 * Serves all files and enables GitHub Pages-like deployment
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

// MIME types
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Remove leading slash
    if (pathname.startsWith('/')) {
        pathname = pathname.slice(1);
    }
    
    // Default to index.html if root
    if (pathname === '' || pathname === '/') {
        pathname = 'index.html';
    }
    
    // Construct full file path
    let filePath = path.join(PUBLIC_DIR, pathname);
    
    // Security: prevent directory traversal
    const realPath = path.resolve(filePath);
    const publicPath = path.resolve(PUBLIC_DIR);
    if (!realPath.startsWith(publicPath)) {
        res.statusCode = 403;
        res.end('Access denied');
        return;
    }
    
    // Check if it's a directory and try index.html
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                // File not found, try .html extension
                if (!filePath.endsWith('.html')) {
                    fs.readFile(filePath + '.html', (err2, data2) => {
                        if (!err2) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', mimeTypes['.html']);
                            res.end(data2);
                            return;
                        }
                        
                        // Still not found, return 404
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('404 - File not found: ' + pathname);
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('404 - File not found: ' + pathname);
                }
                return;
            }
            
            // Get file extension
            const ext = path.extname(filePath).toLowerCase();
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            
            // Set response headers
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', data.length);
            
            // Enable CORS for API calls
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            // Cache control
            if (ext === '.json' || ext === '.js') {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=3600');
            }
            
            res.end(data);
        });
    });
});

// Server listening
server.listen(PORT, '0.0.0.0', () => {
    console.log('\n' + '='.repeat(70));
    console.log('  🚀 FLIPKART CLONE - SERVER RUNNING');
    console.log('='.repeat(70));
    console.log('\n  📱 Local URLs:');
    console.log(`     http://localhost:${PORT}`);
    console.log(`     http://127.0.0.1:${PORT}`);
    console.log('\n  🏠 Homepage:');
    console.log(`     http://localhost:${PORT}/index.html`);
    console.log('\n  📦 Products (32 items):');
    console.log(`     http://localhost:${PORT}/products.json`);
    console.log('\n  📄 Key Pages:');
    console.log(`     http://localhost:${PORT}/product.html?id=1`);
    console.log(`     http://localhost:${PORT}/vercel-homepage.html`);
    console.log(`     http://localhost:${PORT}/homepage-netlify.html`);
    console.log('\n  🛑 Press CTRL+C to stop the server');
    console.log('='.repeat(70) + '\n');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use`);
        process.exit(1);
    } else {
        throw err;
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n\n⚠️  Server shutting down...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
