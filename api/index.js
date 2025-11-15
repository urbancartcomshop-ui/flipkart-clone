const fs = require('fs');
const path = require('path');
const http = require('http');

module.exports = (req, res) => {
  // Parse URL
  let filePath = req.url === '/' ? '/index-mobile.html' : req.url;
  filePath = path.join(__dirname, '../Flipkart', filePath);

  // Security: prevent directory traversal
  const flipkartDir = path.join(__dirname, '../Flipkart');
  if (!filePath.startsWith(flipkartDir)) {
    res.status(404).send('Not Found');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).send('Not Found');
      return;
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.json': 'application/json',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.status(500).send('Server Error');
        return;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.status(200).send(data);
    });
  });
};
