#!/bin/bash

# Railway.app Quick Deploy Script
# This script helps deploy the Flipkart Clone to Railway.app

echo "🚀 Flipkart Clone - Railway.app Deployment"
echo "=========================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI detected"
echo ""

# Login to Railway
echo "📝 Logging in to Railway..."
railway login

echo ""
echo "🔧 Initializing Railway project..."
railway init

echo ""
echo "📦 Setting up Node.js environment..."
railway add

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is now live! Visit your Railway dashboard to get the URL."
echo "Dashboard: https://railway.app"
