# AWS Manual Deployment Guide - Flipkart Clone

## ⚠️ CloudFormation Having Issues? Use Manual Deployment Instead

---

## 🚀 Step 1: Launch EC2 Instance Manually

1. Go to **AWS Console** → **EC2** → **Instances**
2. Click **"Launch Instances"**
3. Configure:
   - **Name:** `flipkart-clone`
   - **AMI:** Amazon Linux 2
   - **Instance Type:** `t2.micro` (Free tier)
   - **Key Pair:** Select your key pair (create if needed)
   - **Security Group:** Create new with these rules:
     - SSH (22) - from 0.0.0.0/0
     - HTTP (80) - from 0.0.0.0/0
     - Custom TCP (3000) - from 0.0.0.0/0
4. Click **"Launch Instance"**
5. **Wait** for instance to be in "Running" state

---

## 🔑 Step 2: Connect via SSH

```bash
# On your computer (Windows PowerShell, Mac Terminal, or Linux)
ssh -i your-key.pem ec2-user@<your-instance-public-ip>
```

**Find your public IP:**
1. Go to AWS EC2 Dashboard
2. Click your instance
3. Copy "Public IPv4 address"

---

## 📥 Step 3: Deploy Application

Once SSH'd into instance, run:

```bash
# Clone and setup
git clone https://github.com/urbancartcomshop-ui/flipkart-clone.git ~/flipkart
cd ~/flipkart/aws_revive

# Install dependencies
npm install

# Start the server
npm run deploy-server
```

**Or use PM2 for background running:**

```bash
sudo npm install -g pm2
pm2 start server-deploy.js --name "flipkart"
pm2 startup
pm2 save
```

---

## 🌐 Step 4: Access Your Application

Once running, visit:

```
http://<your-instance-public-ip>:3000
```

**Replace `<your-instance-public-ip>` with actual IP from AWS Console**

---

## 📊 Verify It's Working

Check logs:
```bash
# If using PM2
pm2 logs flipkart

# Or check directly
curl http://localhost:3000
```

---

## 💰 Cost Breakdown

- **t2.micro:** FREE (first 12 months, AWS free tier)
- **Data transfer:** FREE within AWS
- **Total monthly:** $0 (free tier)

---

## 🛑 Stop & Delete

To avoid charges:

```bash
# Stop the application
pm2 stop flipkart
pm2 delete flipkart

# Terminate instance
# Go to AWS EC2 → Right-click instance → Terminate instance
```

---

## 📝 Troubleshooting

**Port 3000 not responding?**
- Check security group allows port 3000
- Verify app started: `pm2 logs`

**npm install fails?**
- Run: `npm cache clean --force`
- Then try again

**SSH connection refused?**
- Wait 2-3 minutes after instance launch
- Check security group allows SSH (port 22)

---

## ✅ Success Checklist

- ✅ EC2 instance running
- ✅ SSH connected
- ✅ Git cloned repo
- ✅ npm install completed
- ✅ Server started (npm run deploy-server)
- ✅ Port 3000 accessible
- ✅ All 32 products showing
- ✅ Images loading

**You're live! 🎉**
