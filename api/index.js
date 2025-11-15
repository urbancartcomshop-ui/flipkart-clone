const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Serve files from public directory
  let filePath = path.join(__dirname, '../public', req.url === '/' ? 'index.html' : req.url);
  
  // Security check
  const publicDir = path.join(__dirname, '../public');
  if (!filePath.startsWith(publicDir)) {
    res.status(404).send('Not Found');
    return;
  }
  
  // If no extension, assume index.html (for client-side routing)
  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }
  
  try {
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    const fileStats = fs.statSync(filePath);
    const fileContent = fs.readFileSync(filePath);
    
    // Set content type
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
    
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(fileContent);
  } catch (err) {
    // If file not found, serve index.html for client-side routing
    if (err.code === 'ENOENT') {
      try {
        const indexPath = path.join(__dirname, '../public/index.html');
        const indexContent = fs.readFileSync(indexPath);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.status(200).send(indexContent);
      } catch (e) {
        res.status(404).send('Not Found');
      }
    } else {
      res.status(500).send('Server Error');
    }
  }
};
