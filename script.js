// Performance optimization: Defer non-critical operations
const performanceStart = performance.now();

// DARK MODE - Load from localStorage first (synchronous for instant apply)
(function() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) document.documentElement.classList.add('dark');
})();

// Defer other operations until DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // DARK MODE toggle
    const darkBtn = document.getElementById('darkToggle');
    if (darkBtn) {
        darkBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', document.body.classList.contains('dark'));
        });
    }

    // SLIDER with MANUAL CONTROLS - Initialize
    initSlider();
});

// Quick add to cart function (called directly from HTML)
function addToCart(eventOrId, id) {
    // Handle both old calls (just ID) and new calls (event, ID)
    const actualId = (typeof eventOrId === 'number') ? eventOrId : id;
    const event = (typeof eventOrId === 'object') ? eventOrId : null;
    
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    const item = productsFallback[actualId];
    if (!item) return;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✓ Item added to cart!");
}

// SLIDER with MANUAL CONTROLS
let sliderIndex = 0;
let autoSlideTimer;

function initSlider() {
    const slideImgs = document.querySelectorAll('.slider .slide');
    if (slideImgs.length === 0) return;
    updateDots();
    autoSlide();
}

function showSlide(n) {
    const slideImgs = document.querySelectorAll('.slider .slide');
    if (slideImgs.length === 0) return;
    sliderIndex = (n + slideImgs.length) % slideImgs.length;
    const slider = document.querySelector('.slider');
    if (slider) slider.style.transform = `translateX(-${sliderIndex * 100}%)`;
    updateDots();
}

function changeSlide(n) {
    clearInterval(autoSlideTimer);
    showSlide(sliderIndex + n);
    autoSlide();
}

function updateDots() {
    const slideImgs = document.querySelectorAll('.slider .slide');
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slideImgs.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === sliderIndex ? ' active' : '');
        dot.onclick = () => { clearInterval(autoSlideTimer); showSlide(i); autoSlide(); };
        dotsContainer.appendChild(dot);
    }
}

function autoSlide() {
    autoSlideTimer = setInterval(() => {
        showSlide(sliderIndex + 1);
    }, 4000);
}

// PRODUCT DATA fallback
const productsFallback = {
    1: { id: 1, name: "Redmi Note 12", price: 12999, img: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop", description: "Redmi Note 12 with 6.5-inch FHD+ display, Snapdragon 685 processor, 5000mAh battery, 50MP camera, and fast charging support.", specs: ["6.5-inch FHD+ Display", "Snapdragon 685", "4GB/128GB Storage", "5000mAh Battery", "50MP Main Camera", "90Hz Refresh Rate"], rating: 4.5, reviews: 2500 },
    2: { id: 2, name: "Samsung M14", price: 14499, img: "https://images.unsplash.com/photo-1511740357442-ee464c3f3c0d?w=400&h=400&fit=crop", description: "Samsung M14 featuring 6.5-inch IPS display, MediaTek Helio G88 processor, 5000mAh battery with 25W fast charging, and dual camera system.", specs: ["6.5-inch IPS Display", "MediaTek Helio G88", "4GB/128GB Storage", "5000mAh Battery", "13MP Main Camera", "2 Days Battery Life"], rating: 4.7, reviews: 1800 },
    3: { id: 3, name: "Wireless Earbuds Pro", price: 4999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", description: "Premium wireless earbuds with active noise cancellation, 30-hour total battery life, IPX4 water resistance, and premium sound quality.", specs: ["Active Noise Cancellation", "30-Hour Total Battery", "IPX4 Water Resistant", "Bluetooth 5.0", "Touch Controls", "Premium Sound Quality"], rating: 4.3, reviews: 1200 },
    4: { id: 4, name: "Smart Watch Series 5", price: 8999, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", description: "Advanced smartwatch with AMOLED display, health tracking, GPS navigation, 5ATM water resistance, and up to 14 days battery life.", specs: ["1.4-inch AMOLED Display", "GPS Navigation", "Heart Rate Monitor", "Sleep Tracking", "5ATM Water Resistance", "14 Days Battery"], rating: 4.6, reviews: 3100 },
    5: { id: 5, name: "Premium USB-C Cable", price: 599, img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop", description: "High-quality USB-C cable with fast charging support up to 100W, durable braided design, and certified for safe data transfer.", specs: ["100W Fast Charging", "Braided Design", "2 Meter Length", "USB 3.1 Speed", "Certified Safe", "Lifetime Warranty"], rating: 4.8, reviews: 5200 },
    6: { id: 6, name: "Protective Phone Case", price: 899, img: "https://images.unsplash.com/photo-1510557880182-3d4d3f4650c2?w=400&h=400&fit=crop", description: "Rugged protective case with military-grade shock absorption, premium leather back, and raised bezel protection for your smartphone.", specs: ["Military Grade Protection", "Premium Leather", "Shock Absorption", "Raised Bezel", "Slim Design", "Multiple Color Options"], rating: 4.4, reviews: 4000 }
};

const API_BASE = (typeof window !== 'undefined' && window.API_BASE) ? window.API_BASE : '';

async function fetchProducts() {
    try {
        const res = await fetch(API_BASE + '/api/products');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const map = {};
        data.forEach(p => map[p.id] = p);
        return map;
    } catch (e) {
        return productsFallback;
    }
}

// Render product grid on index page
if (window.location.pathname.endsWith('/') || window.location.pathname.includes('index.html')) {
    (async () => {
        const products = await fetchProducts();
        const container = document.querySelector('.products');
        if (container) {
            container.innerHTML = '';
            Object.values(products).forEach(p => {
                container.innerHTML += `
                <div class="product-card">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.img}" alt="${p.name}">
                        <h3>${p.name}</h3>
                    </a>
                    <p class="price">₹${p.price}</p>
                    <button class="btn addCart" data-id="${p.id}">Add to Cart</button>
                </div>`;
            });

            // Wire Add to Cart buttons
            container.querySelectorAll('.addCart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    addToCart(id);
                });
            });
        }
    })();
}

// PRODUCT DETAILS PAGE LOGIC
if (window.location.pathname.includes("product.html")) {
    (async () => {
        let id = new URLSearchParams(window.location.search).get("id");
        let productObj = productsFallback[id];
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) productObj = await res.json();
        } catch (e) { /* fallback used */ }

        if (productObj) {
            const img = document.getElementById("prodImg");
            const name = document.getElementById("prodName");
            const price = document.getElementById("prodPrice");
            const desc = document.getElementById("prodDescription");
            const starRating = document.getElementById("starRating");
            const reviewCount = document.getElementById("reviewCount");
            const specsList = document.getElementById("specsList");
            
            if (img) img.src = productObj.img;
            if (name) name.innerText = productObj.name;
            if (price) price.innerText = "₹" + productObj.price;
            if (desc) desc.innerText = productObj.description;
            if (starRating) starRating.innerText = `⭐ ${productObj.rating || 4.5}`;
            if (reviewCount) reviewCount.innerText = `(${(productObj.reviews || 2500).toLocaleString()} reviews)`;
            
            if (specsList && productObj.specs) {
                specsList.innerHTML = '';
                productObj.specs.forEach(spec => {
                    const li = document.createElement('li');
                    li.innerText = spec;
                    specsList.appendChild(li);
                });
            }

            const addBtn = document.getElementById("addCartDetails");
            if (addBtn) addBtn.onclick = () => addToCart(id);

            let buyBtn = document.getElementById('buyNow');
            if (!buyBtn) {
                buyBtn = document.createElement('button');
                buyBtn.id = 'buyNow';
                buyBtn.className = 'btn buy-now';
                buyBtn.innerText = '⚡ Buy Now';
                addBtn.parentNode.insertBefore(buyBtn, addBtn.nextSibling);
            }
            buyBtn.onclick = () => {
                addToCart(id);
                window.location.href = 'checkout.html';
            };
        }
    })();
}

// CART SYSTEM
function addToCart(id) {
    const productsMap = JSON.parse(localStorage.getItem('productsMap') || '{}');
    const item = productsMap[id] || productsFallback[id] || { id: id, name: 'Product', price: 0 };
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    // Persist a lightweight products map so cart display can show names/prices
    productsMap[id] = item;
    localStorage.setItem('productsMap', JSON.stringify(productsMap));
    alert("Item added to cart!");
}

// CART PAGE
if (window.location.pathname.includes("cart.html")) {
    let cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    let container = document.getElementById("cartItems");

    if (cartItems.length === 0) {
        container.innerHTML = "<h3>Your cart is empty.</h3>";
    } else {
        cartItems.map(item => {
            container.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>₹${item.price}</span>
                </div>
            `;
        });
    }
}

// CHECKOUT PAGE
if (window.location.pathname.includes("checkout.html")) {
    (async () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const container = document.getElementById("checkoutItems");
        const form = document.getElementById("checkoutForm");
        if (!container || !form) return;

        if (cart.length === 0) {
            container.innerHTML = "<h3>Your cart is empty.</h3>";
            form.style.display = 'none';
            return;
        }

        // Aggregate items into {id, price, qty, name}
        const map = {};
        cart.forEach(it => {
            const id = it.id;
            if (!map[id]) map[id] = { id: it.id, price: it.price || 0, qty: 0, name: it.name || 'Product' };
            map[id].qty += 1;
        });

        let total = 0;
        container.innerHTML = '';
        Object.values(map).forEach(i => {
            total += i.price * i.qty;
            container.innerHTML += `\n                <div class="cart-item">\n                    <span>${i.name} x ${i.qty}</span>\n                    <span>₹${i.price * i.qty}</span>\n                </div>\n            `;
        });
        container.innerHTML += `\n            <div class="cart-item"><strong>Total</strong><strong>₹${total}</strong></div>\n        `;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.querySelector('#custName').value.trim();
            const email = form.querySelector('#custEmail').value.trim();
            if (!name || !email) { alert('Please enter name and email'); return; }

            const payload = {
                items: Object.values(map).map(i => ({ id: Number(i.id), price: Number(i.price), qty: i.qty })),
                customer: { name, email }
            };

            try {
                const res = await fetch(API_BASE + '/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Order failed');
                const data = await res.json();
                localStorage.removeItem('cart');
                localStorage.removeItem('productsMap');
                container.innerHTML = `<h3>Order placed. Order ID: ${data.id}</h3><p>Thank you, ${name}.</p>`;
                form.style.display = 'none';
            } catch (err) {
                alert('Failed to place order. Please try again.');
            }
        });
    })();
}
