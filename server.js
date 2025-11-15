const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const REGION = process.env.HOST_REGION || process.env.REGION || 'af-south-1';

// Load products from database
const productsDB = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products-database.json'), 'utf8'));
const products = productsDB.products;
const categories = productsDB.categories;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS, images) from project root
app.use(express.static(path.join(__dirname)));

// Health check for AWS/App Runner/ALB
app.get('/_health', (req, res) => {
  res.status(200).send('ok');
});

// --- Products API ---
app.get('/api/products', (req, res) => {
  const { category, subcategory, search, sort, minPrice, maxPrice } = req.query;
  
  let filteredProducts = [...products];
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  // Filter by subcategory
  if (subcategory) {
    filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
  }
  
  // Search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      (p.features && p.features.some(f => f.toLowerCase().includes(searchLower)))
    );
  }
  
  // Price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
  }
  
  // Sort
  if (sort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    filteredProducts.sort((a, b) => b.discount - a.discount);
  }
  
  res.json(filteredProducts.map(p => ({ ...p, region: REGION })));
});

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (p) res.json({ ...p, region: REGION });
  else res.status(404).json({ error: 'Product not found' });
});

// --- Orders API ---
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
// ensure data folder
try { fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true }); } catch (e) {}
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));

app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE));
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order || !order.items || !Array.isArray(order.items) || order.items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE));
  order.id = (orders.length === 0) ? 1 : (orders[orders.length - 1].id + 1);
  order.createdAt = new Date().toISOString();
  order.region = REGION;
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  res.status(201).json(order);
});

// Health endpoint
app.get('/_health', (req, res) => res.json({ status: 'ok', region: REGION }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT} (region=${REGION})`);
});
