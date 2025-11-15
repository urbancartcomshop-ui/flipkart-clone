#!/bin/bash
# Direct EC2 Deployment Script for Flipkart Clone
# Run this on an EC2 instance after launch

set -e

echo "🚀 Installing Flipkart Clone..."

# Update system
sudo yum update -y
sudo yum install -y nodejs npm git curl wget

# Create app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Clone repository
git clone https://github.com/urbancartcomshop-ui/flipkart-clone.git .

# Install dependencies
npm install

# Navigate to aws_revive folder
cd aws_revive

# Install PM2 globally for process management
sudo npm install -g pm2

# Start the application
pm2 start server-deploy.js --name "flipkart-server"
pm2 startup
pm2 save

echo "✅ Flipkart Clone deployed successfully!"
echo "📱 Access at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
