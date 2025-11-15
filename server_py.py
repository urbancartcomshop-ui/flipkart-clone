import http.server
import socketserver
import json
import urllib
import os
import gzip
import io

# Use PORT from environment variable (for Render.com) or default to 3000
PORT = int(os.environ.get('PORT', 3000))

products = [
    {"id": 1, "name": "Redmi Note 12", "price": 12999, "img": "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", "description": "Redmi Note 12 with 6.5-inch FHD+ display, Snapdragon 685 processor, 5000mAh battery, 50MP camera, and fast charging support.", "specs": ["6.5-inch FHD+ Display", "Snapdragon 685", "4GB/128GB Storage", "5000mAh Battery", "50MP Main Camera", "90Hz Refresh Rate"], "rating": 4.5, "reviews": 2500},
    {"id": 2, "name": "Samsung M14", "price": 14499, "img": "https://images.unsplash.com/photo-1511740357442-ee464c3f3c0d?w=400&h=400&fit=crop", "description": "Samsung M14 featuring 6.5-inch IPS display, MediaTek Helio G88 processor, 5000mAh battery with 25W fast charging, and dual camera system.", "specs": ["6.5-inch IPS Display", "MediaTek Helio G88", "4GB/128GB Storage", "5000mAh Battery", "13MP Main Camera", "2 Days Battery Life"], "rating": 4.7, "reviews": 1800},
    {"id": 3, "name": "Wireless Earbuds Pro", "price": 4999, "img": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", "description": "Premium wireless earbuds with active noise cancellation, 30-hour total battery life, IPX4 water resistance, and premium sound quality.", "specs": ["Active Noise Cancellation", "30-Hour Total Battery", "IPX4 Water Resistant", "Bluetooth 5.0", "Touch Controls", "Premium Sound Quality"], "rating": 4.3, "reviews": 1200},
    {"id": 4, "name": "Smart Watch Series 5", "price": 8999, "img": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", "description": "Advanced smartwatch with AMOLED display, health tracking, GPS navigation, 5ATM water resistance, and up to 14 days battery life.", "specs": ["1.4-inch AMOLED Display", "GPS Navigation", "Heart Rate Monitor", "Sleep Tracking", "5ATM Water Resistance", "14 Days Battery"], "rating": 4.6, "reviews": 3100},
    {"id": 5, "name": "Premium USB-C Cable", "price": 599, "img": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop", "description": "High-quality USB-C cable with fast charging support up to 100W, durable braided design, and certified for safe data transfer.", "specs": ["100W Fast Charging", "Braided Design", "2 Meter Length", "USB 3.1 Speed", "Certified Safe", "Lifetime Warranty"], "rating": 4.8, "reviews": 5200},
    {"id": 6, "name": "Protective Phone Case", "price": 899, "img": "https://images.unsplash.com/photo-1510557880182-3d4d3f4650c2?w=400&h=400&fit=crop", "description": "Rugged protective case with military-grade shock absorption, premium leather back, and raised bezel protection for your smartphone.", "specs": ["Military Grade Protection", "Premium Leather", "Shock Absorption", "Raised Bezel", "Slim Design", "Multiple Color Options"], "rating": 4.4, "reviews": 4000}
]

class Handler(http.server.SimpleHTTPRequestHandler):
    def _set_cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def end_headers(self):
        # Add caching headers for better performance
        if self.path.endswith(('.js', '.css', '.woff', '.woff2', '.ttf', '.eot')):
            self.send_header('Cache-Control', 'public, max-age=31536000')  # 1 year
        elif self.path.endswith(('.html',)):
            self.send_header('Cache-Control', 'public, max-age=3600')  # 1 hour
        else:
            self.send_header('Cache-Control', 'public, max-age=86400')  # 1 day
        
        # Add security and performance headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('Connection', 'keep-alive')  # Enable persistent connections
        self.send_header('Accept-Encoding', 'gzip, deflate')  # Enable compression
        
        # Add preload and prefetch hints for critical resources
        if self.path.endswith(('index.html',)):
            self.send_header('Link', '</style.css>; rel=preload; as=style, </script.js>; rel=preload; as=script')
        # CORS
        self._set_cors()
        super().end_headers()
    
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        # Health check endpoint for Render/ALBs
        if parsed_path.path == '/_health':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self._set_cors()
            self.end_headers()
            self.wfile.write(b'ok')
            return
        # Redirect root to Flipkart index for nicer URL on hosts like Render
        if parsed_path.path in ('/', '/index.html'):
            self.path = '/Flipkart/index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        
        # API endpoints
        if parsed_path.path == '/api/products':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._set_cors()
            self.end_headers()
            data = json.dumps(products).encode('utf-8')
            # Check if client supports gzip
            if 'gzip' in self.headers.get('Accept-Encoding', ''):
                self.send_header('Content-Encoding', 'gzip')
                data = gzip.compress(data)
            self.wfile.write(data)
            return
        
        elif parsed_path.path.startswith('/api/products/'):
            try:
                pid = int(parsed_path.path.split('/')[-1])
                prod = next((p for p in products if p['id'] == pid), None)
                if prod:
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self._set_cors()
                    self.end_headers()
                    data = json.dumps(prod).encode('utf-8')
                    if 'gzip' in self.headers.get('Accept-Encoding', ''):
                        self.send_header('Content-Encoding', 'gzip')
                        data = gzip.compress(data)
                    self.wfile.write(data)
                    return
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self._set_cors()
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'not found'}).encode('utf-8'))
                    return
            except Exception:
                self.send_response(400)
                self._set_cors()
                self.end_headers()
                return
        
        else:
            # Serve static files
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(204)
        self._set_cors()
        self.end_headers()

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__) or '.')
    with socketserver.TCPServer(('0.0.0.0', PORT), Handler) as httpd:
        print(f'Serving at http://localhost:{PORT}')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('Shutting down')
            httpd.server_close()
