const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read products from products.json
    const productsPath = path.join(__dirname, '../../public/products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    let products = JSON.parse(productsData);

    // Handle query parameters for filtering
    const { category, sort, limit } = event.queryStringParameters || {};

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    // Sort by rating or discount
    if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      products.sort((a, b) => b.discount - a.discount);
    } else if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    }

    // Limit results
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
