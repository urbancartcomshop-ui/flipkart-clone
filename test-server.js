const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Server is working!</h1><p>Your server is running correctly.</p>');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Test server running on http://localhost:3000');
});
