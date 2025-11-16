# Docker Setup Guide - Flipkart Clone

## Prerequisites
- **Docker Desktop** installed (https://www.docker.com/products/docker-desktop)
- Windows PowerShell or Command Prompt

## Quick Start (3 Steps)

### Step 1: Open Docker Desktop
- Launch **Docker Desktop** application
- Wait for it to start (you'll see the Docker icon in system tray)

### Step 2: Build the Docker Image
Open PowerShell in your project folder and run:

```powershell
cd "c:\Users\nitin sabharwal\New folder"
docker-compose up --build
```

**First time will take 2-3 minutes** (downloading Node, installing packages)

You'll see:
```
flipkart-clone-server  | Server running at http://localhost:3000
```

### Step 3: Open in Browser
Visit: **http://localhost:3000**

You should see:
✅ Flipkart logo & blue header
✅ Search bar with search button
✅ Festival sale banner
✅ Product grid with 32 products
✅ All filters working
✅ Mobile responsive design

---

## Features You Can Test

1. **Search Products**
   - Type "OnePlus", "JBL", "Smartwatch"
   - Click search button or press Enter
   - See filtered results instantly

2. **Click Any Product**
   - Goes to detailed product page
   - Shows product description
   - Shows Indian customer reviews (Rajesh Kumar, Priya Singh, etc.)
   - Shows ratings and reviews from cities

3. **Buy Now**
   - Click "Buy Now" button
   - Opens UPI payment modal (default method)
   - Shows options for Card, Net Banking, Wallet
   - Enter UPI ID and complete payment

4. **Filters**
   - Category: Electronics, Appliances
   - Price: Min to Max
   - Rating: 2★, 3★, 4★ and above
   - Discount: 30%, 50%

5. **Sort**
   - Relevance
   - Price: Low to High / High to Low
   - Highest Rated
   - Biggest Discount

---

## Docker Commands

### Stop the server
Press `Ctrl + C` in the terminal

### Restart the server
```powershell
docker-compose up
```

### Remove container and images
```powershell
docker-compose down
docker system prune -a
```

### View logs
```powershell
docker-compose logs -f
```

### Rebuild (if code changes)
```powershell
docker-compose up --build
```

---

## Troubleshooting

### Port 3000 already in use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Container won't start
```powershell
# Clean everything
docker-compose down
docker system prune -a
docker-compose up --build
```

### Out of disk space
```powershell
docker system prune -a --volumes
```

---

## After Testing - Deploy to Production

Once everything works locally, deploy to **Heroku** (FREE):

1. Go to https://www.heroku.com/
2. Click "Create New App"
3. Connect your GitHub repo `flipkart-clone`
4. Enable auto-deploy
5. Your site will be live at: `https://your-app-name.herokuapp.com`

---

## Project Structure
```
flipkart-clone/
├── Dockerfile                 # Container config
├── docker-compose.yml        # Docker compose config
├── package.json             # Node dependencies
├── index.js                 # Express server
└── public/
    ├── home.html           # Main homepage
    ├── product.html        # Product detail page
    ├── products.json       # 32 products data
    └── style.css           # Styles
```

---

## All Data Included
✅ 32 Products with prices, ratings, images
✅ Indian customer reviews with names & cities
✅ UPI payment integration
✅ Mobile responsive design
✅ Product search & filters
✅ Category sorting
✅ Price range filtering
✅ Rating filtering
✅ Discount display

---

Need help? Everything is set up and ready to go!
