# Flipkart - E-Commerce Website

A fully functional e-commerce website with premium animations, encrypted HTTPS server, and Africa region support.

## 🌐 Live Demo
**Coming Soon**: `https://flipkart-store.onrender.com`

## ✨ Features
- 🛍️ 40+ Premium Products
- 🎨 Animated UI with Flipkart Design
- 🔒 HTTPS Encrypted Server
- 🌍 Africa Region (Cape Town) Configuration
- 📱 Mobile Responsive
- ⚡ Fast Performance with Lazy Loading
- 🎯 Product Details, Cart, Checkout Pages

## 🚀 Quick Deploy to Render.com

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Deployment Steps:

1. Fork or clone this repository
2. Sign up at [Render.com](https://render.com)
3. Create new "Web Service"
4. Connect your repository
5. Render will auto-detect and deploy!

Your site will be live at: `https://shopmart-africa.onrender.com`

## 📂 Project Structure
```
├── Flipkart/              # Frontend HTML pages
│   ├── index.html         # Homepage
│   ├── product-details.html
│   ├── cart.html
│   └── checkout.html
├── server_py.py           # Python HTTP server
├── server_https_africa.py # HTTPS encrypted server
├── style.css              # Premium animations & design
├── script.js              # Interactive features
├── requirements.txt       # Python dependencies
├── render.yaml            # Render deployment config
├── Dockerfile             # Docker container
└── docker-compose.yml     # Docker setup

```

## 💻 Run Locally

### Option 1: Python Server
```bash
python server_py.py
# Visit: http://localhost:3000/Flipkart/index.html
```

### Option 2: HTTPS Server (Africa Region)
```bash
pip install pyOpenSSL
python server_https_africa.py
# Visit: https://localhost:8443/Flipkart/index.html
```

### Option 3: Docker
```bash
docker-compose up
# Visit: http://localhost:8080/Flipkart/index.html
```

## 🌍 AWS Deployment

Full AWS deployment with Terraform available in `deploy/terraform/`
- Region: af-south-1 (Cape Town, South Africa)
- ECS Fargate with Auto-scaling
- Application Load Balancer
- See `AWS_DEPLOYMENT_GUIDE.md` for details

### One-Command Deploy (App Runner + S3/CloudFront)
- Prereqs: AWS CLI v2, Docker Desktop, `aws configure` completed.
- Runs on Windows PowerShell 5.1.

Run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass; ./scripts/deploy-all.ps1
```

What it does:
- Builds and pushes the API image to ECR, deploys AWS App Runner (port `8080`, health `/_health`).
- Uploads static site to S3 and fronts it with CloudFront (HTTPS, fast global CDN).
- Auto-injects the App Runner URL into `static.config.js` so the frontend calls the right API.

Outputs at the end:
- `API URL`: App Runner domain
- `Website URL`: CloudFront domain (share this link)

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Python HTTP Server
- **Styling**: Custom CSS with Animations
- **Deployment**: Render.com, AWS ECS, Docker
- **Region**: Africa (Cape Town)

## 📱 Share Your Link

After deploying to Render, share your link:
```
https://flipko-store.onrender.com/Flipkart/index.html
```

Works on:
- ✅ iPhone/Android phones
- ✅ Tablets
- ✅ Desktop browsers
- ✅ Any device with internet

## 📄 License
Open Source - 2025

## 🤝 Contributing
Feel free to fork and customize for your own store!

---

**Made with ❤️ in Cape Town, South Africa 🇿🇦**
