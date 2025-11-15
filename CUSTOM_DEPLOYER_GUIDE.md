# Custom Deployer - Complete Guide

## 🚀 What is This?

A **100% custom deployer** built from scratch that:
- ✅ Connects to any Linux server via SSH
- ✅ Installs all dependencies automatically
- ✅ Clones and deploys your Flipkart app
- ✅ Sets up automatic process management
- ✅ No reliance on CloudFormation, Render, Railway, etc.
- ✅ Works with AWS EC2, DigitalOcean, Linode, etc.

---

## 📋 Requirements

### On Your Computer (Windows/Mac/Linux):
- Python 3.6+
- SSH client
- Git (optional, for reference)

### On Target Server:
- Linux (Amazon Linux 2, Ubuntu, CentOS, etc.)
- SSH access with key pair

---

## 🎯 Quick Start

### Step 1: Prepare Your Server

**Option A: AWS EC2**
1. Go to AWS EC2 Console
2. Launch Instance:
   - AMI: Amazon Linux 2
   - Type: t2.micro (free)
   - Key Pair: Create/select one
   - Security: Allow SSH (22) and port 3000
3. Wait for "Running" state
4. Copy "Public IPv4" address

**Option B: Any Other Linux Server**
- Get SSH credentials
- Have server IP/hostname
- Have SSH private key (.pem or similar)

### Step 2: Run the Deployer

**Windows:**
```powershell
# Option 1: PowerShell
.\deploy.ps1

# Option 2: Command Prompt
deploy.bat

# Option 3: Direct Python
python deployer.py
```

**Mac/Linux:**
```bash
python3 deployer.py
```

### Step 3: Follow Interactive Prompts

The deployer will ask for:
- Server IP/hostname
- SSH username (default: ec2-user for AWS)
- Path to SSH key file
- SSH port (default: 22)

### Step 4: Wait for Deployment

The deployer will:
1. ✅ Connect to server
2. ✅ Update system
3. ✅ Install Node.js, npm, git
4. ✅ Clone Flipkart repo
5. ✅ Install dependencies
6. ✅ Start application
7. ✅ Setup auto-restart

Takes about 3-5 minutes.

---

## 📱 Access Your App

After deployment completes, visit:
```
http://<your-server-ip>:3000
```

**Example:** `http://54.123.45.67:3000`

---

## 🔧 Useful Commands

### View Logs
```bash
ssh -i your-key.pem ec2-user@your-ip "pm2 logs flipkart-server"
```

### Check Status
```bash
ssh -i your-key.pem ec2-user@your-ip "pm2 status"
```

### Restart Application
```bash
ssh -i your-key.pem ec2-user@your-ip "pm2 restart flipkart-server"
```

### Stop Application
```bash
ssh -i your-key.pem ec2-user@your-ip "pm2 stop flipkart-server"
```

---

## 🐛 Troubleshooting

### "SSH connection failed"
- Verify server IP is correct
- Check SSH key path is correct
- Ensure security group allows port 22
- Wait 2-3 minutes after EC2 launch

### "npm install fails"
- Run: `ssh -i key.pem user@ip "npm cache clean --force"`
- Then try deploying again

### "Port 3000 not responding"
- Check: `ssh -i key.pem user@ip "pm2 status"`
- View logs: `ssh -i key.pem user@ip "pm2 logs"`
- Ensure security group allows port 3000

### "Application not starting"
- SSH into server: `ssh -i key.pem user@ip`
- Check: `pm2 logs flipkart-server`
- Try manual: `cd ~/flipkart-app/aws_revive && npm run deploy-server`

---

## 💰 Cost

**AWS EC2 t2.micro:** FREE for first 12 months (free tier)

No other costs with this deployer.

---

## 🛑 Cleanup

### To stop the application:
```bash
ssh -i key.pem user@ip "pm2 stop flipkart-server"
```

### To remove from server:
```bash
ssh -i key.pem user@ip "rm -rf ~/flipkart-app"
```

### To terminate EC2 instance:
1. Go to AWS EC2 Console
2. Right-click instance
3. Instance State → Terminate

---

## 📞 Support

**If deployer fails:**
1. Check all requirements are installed
2. Verify SSH connection manually: `ssh -i key.pem user@ip`
3. Check server logs manually
4. Verify security groups allow required ports

---

## ✅ What Gets Deployed

- 32 complete products with metadata
- 160 high-quality product images
- Full e-commerce UI (homepage, product details, checkout)
- Add to cart functionality
- Checkout page
- Mobile responsive design
- All data and assets

---

**Your custom deployer is ready to use! 🚀**
