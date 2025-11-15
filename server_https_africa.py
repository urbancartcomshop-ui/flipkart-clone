import http.server
import ssl
import socketserver
import json
import urllib
import os
import gzip

PORT = 8443
REGION = "af-south-1"  # Africa (Cape Town)
LOCATION = "Cape Town, South Africa"

products = [
    {"id": 1, "name": "Redmi Note 12", "price": 12999, "img": "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", "description": "Redmi Note 12 with 6.5-inch FHD+ display, Snapdragon 685 processor, 5000mAh battery, 50MP camera, and fast charging support.", "specs": ["6.5-inch FHD+ Display", "Snapdragon 685", "4GB/128GB Storage", "5000mAh Battery", "50MP Main Camera", "90Hz Refresh Rate"], "rating": 4.5, "reviews": 2500, "region": REGION, "location": LOCATION},
    {"id": 2, "name": "Samsung M14", "price": 14499, "img": "https://images.unsplash.com/photo-1511740357442-ee464c3f3c0d?w=400&h=400&fit=crop", "description": "Samsung M14 featuring 6.5-inch IPS display, MediaTek Helio G88 processor, 5000mAh battery with 25W fast charging, and dual camera system.", "specs": ["6.5-inch IPS Display", "MediaTek Helio G88", "4GB/128GB Storage", "5000mAh Battery", "13MP Main Camera", "2 Days Battery Life"], "rating": 4.7, "reviews": 1800, "region": REGION, "location": LOCATION},
    {"id": 3, "name": "Wireless Earbuds Pro", "price": 4999, "img": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", "description": "Premium wireless earbuds with active noise cancellation, 30-hour total battery life, IPX4 water resistance, and premium sound quality.", "specs": ["Active Noise Cancellation", "30-Hour Total Battery", "IPX4 Water Resistant", "Bluetooth 5.0", "Touch Controls", "Premium Sound Quality"], "rating": 4.3, "reviews": 1200, "region": REGION, "location": LOCATION},
    {"id": 4, "name": "Smart Watch Series 5", "price": 8999, "img": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", "description": "Advanced smartwatch with AMOLED display, health tracking, GPS navigation, 5ATM water resistance, and up to 14 days battery life.", "specs": ["1.4-inch AMOLED Display", "GPS Navigation", "Heart Rate Monitor", "Sleep Tracking", "5ATM Water Resistance", "14 Days Battery"], "rating": 4.6, "reviews": 3100, "region": REGION, "location": LOCATION},
    {"id": 5, "name": "Premium USB-C Cable", "price": 599, "img": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop", "description": "High-quality USB-C cable with fast charging support up to 100W, durable braided design, and certified for safe data transfer.", "specs": ["100W Fast Charging", "Braided Design", "2 Meter Length", "USB 3.1 Speed", "Certified Safe", "Lifetime Warranty"], "rating": 4.8, "reviews": 5200, "region": REGION, "location": LOCATION},
    {"id": 6, "name": "Protective Phone Case", "price": 899, "img": "https://images.unsplash.com/photo-1510557880182-3d4d3f4650c2?w=400&h=400&fit=crop", "description": "Rugged protective case with military-grade shock absorption, premium leather back, and raised bezel protection for your smartphone.", "specs": ["Military Grade Protection", "Premium Leather", "Shock Absorption", "Raised Bezel", "Slim Design", "Multiple Color Options"], "rating": 4.4, "reviews": 4000, "region": REGION, "location": LOCATION}
]

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add caching headers for better performance
        if self.path.endswith(('.js', '.css', '.woff', '.woff2', '.ttf', '.eot')):
            self.send_header('Cache-Control', 'public, max-age=31536000')
        elif self.path.endswith(('.html',)):
            self.send_header('Cache-Control', 'public, max-age=3600')
        else:
            self.send_header('Cache-Control', 'public, max-age=86400')
        
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        self.send_header('X-Server-Region', REGION)
        self.send_header('X-Server-Location', LOCATION)
        super().end_headers()
    
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        
        # API endpoints
        if parsed_path.path == '/api/products':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = json.dumps(products).encode('utf-8')
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
                    self.end_headers()
                    data = json.dumps(prod).encode('utf-8')
                    if 'gzip' in self.headers.get('Accept-Encoding', ''):
                        data = gzip.compress(data)
                    self.wfile.write(data)
                    return
                else:
                    self.send_response(404)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'not found'}).encode('utf-8'))
                    return
            except Exception:
                self.send_response(400)
                self.end_headers()
                return
        
        elif parsed_path.path == '/api/server-info':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            info = {
                'region': REGION,
                'location': LOCATION,
                'protocol': 'HTTPS',
                'encryption': 'TLS 1.2+',
                'port': PORT
            }
            self.wfile.write(json.dumps(info).encode('utf-8'))
            return
        
        else:
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    os.chdir(os.path.dirname(__file__) or '.')
    
    # Generate self-signed certificate using Python
    print("🔐 Generating self-signed SSL certificate for Africa region...")
    
    from OpenSSL import crypto
    
    # Create a key pair
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 2048)
    
    # Create a self-signed cert
    cert = crypto.X509()
    cert.get_subject().C = "ZA"
    cert.get_subject().ST = "Western Cape"
    cert.get_subject().L = "Cape Town"
    cert.get_subject().O = "Flipko Africa"
    cert.get_subject().CN = "localhost"
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(365*24*60*60)
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(k)
    cert.sign(k, 'sha256')
    
    # Save certificate and key
    with open('cert.pem', 'wb') as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    with open('key.pem', 'wb') as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k))
    
    # Create HTTPS server
    httpd = socketserver.TCPServer(('0.0.0.0', PORT), Handler)
    
    # Wrap with SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('cert.pem', 'key.pem')
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f'🌍 Encrypted HTTPS Server Running')
    print(f'📍 Location: {LOCATION}')
    print(f'🌐 Region: {REGION}')
    print(f'🔒 Protocol: HTTPS (TLS)')
    print(f'🚀 Server: https://localhost:{PORT}')
    print(f'🛑 Press Ctrl+C to stop')
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n🛑 Shutting down encrypted server...')
        httpd.server_close()
