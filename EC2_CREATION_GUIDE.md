# EC2 INSTANCE CREATION - STEP BY STEP

## 🔗 Quick Links
- AWS Console: https://console.aws.amazon.com
- EC2 Dashboard: https://console.aws.amazon.com/ec2

---

## ⚡ Quick Summary

| What | Setting |
|------|---------|
| AMI | Amazon Linux 2 (FREE tier) |
| Instance Type | t2.micro (FREE for 12 months) |
| Storage | 8GB (default) |
| Security Group | Create new with ports: 22, 80, 3000 |
| Key Pair | Create new "flipkart-key" |
| Cost | FREE (first 12 months) |

---

## 📝 DETAILED STEPS

### STEP 1-2: Go to EC2 Dashboard
```
1. Open: https://console.aws.amazon.com
2. Search bar → Type "EC2"
3. Click "EC2" result
```

### STEP 3: Click Launch Instances
```
Big orange button that says "Launch Instances"
```

### STEP 4: Select AMI (Operating System)
```
1. Search box → Type "Amazon Linux 2"
2. Find the one labeled "Free tier eligible"
3. Click "Select" button
```

### STEP 5: Choose Instance Type
```
1. Look for "t2.micro" row
2. This is FREE for 12 months
3. Make sure it's selected (radio button)
4. Click "Next: Configure Instance Details"
```

### STEP 6: Configure Instance Details
```
Leave everything as default
Click "Next: Add Storage"
```

### STEP 7: Add Storage
```
Size: 8 GB (default is fine)
Click "Next: Add Tags"
```

### STEP 8: Add Tags (Optional but helpful)
```
Click "Add Tag"
Key: Name
Value: flipkart-server
Click "Next: Configure Security Group"
```

### STEP 9: Configure Security Group ⭐ IMPORTANT
```
Radio button: "Create a new security group"
Security group name: flipkart-sg
Description: (auto-filled is fine)

ADD THESE INBOUND RULES:

Rule 1:
  Type: SSH
  Port: 22
  Source: 0.0.0.0/0

Rule 2:
  Type: HTTP
  Port: 80
  Source: 0.0.0.0/0

Rule 3:
  Type: Custom TCP
  Port Range: 3000
  Source: 0.0.0.0/0

Click "Review and Launch"
```

### STEP 10: Review
```
Check all settings look correct
Click "Launch" button
```

### STEP 11: Select Key Pair ⭐ IMPORTANT
```
Dropdown: Select "Create a new key pair"
Key pair name: flipkart-key
Download the .pem file
SAVE IT SOMEWHERE SAFE!

Click "Launch Instances"
```

### STEP 12: Wait for Running Status
```
You'll see success message
Click "View Instances"
Wait for Status to show "running" (green)
Wait 1-2 minutes for full startup
```

---

## 📋 WHAT YOU GET

After these steps, you'll have:

✅ **Running EC2 Instance** - Your server
✅ **Public IPv4 Address** - Your server's IP
✅ **SSH Key (flipkart-key.pem)** - Access your server

Example:
```
IP: 54.123.45.67
Key: flipkart-key.pem
```

---

## 🎯 NEXT STEPS

1. Copy your **Public IPv4** address
2. Save your **flipkart-key.pem** file
3. Run **START_DEPLOYMENT.bat** on your computer
4. When prompted:
   - Enter your IP: `54.123.45.67`
   - Enter path to key: `C:\Users\yourname\Downloads\flipkart-key.pem`
5. Wait 3-5 minutes
6. Visit: `http://54.123.45.67:3000` ✅

---

## ❓ COMMON QUESTIONS

**Q: Is t2.micro really free?**
A: Yes! AWS free tier gives 750 hours/month for 12 months = completely free

**Q: What if I lose my key?**
A: You'll need to create a new instance. Keep the .pem file safe!

**Q: How much will it cost after 12 months?**
A: t2.micro costs ~$10/month after free tier. You can always delete the instance to stop charges.

**Q: Can I use existing key pair?**
A: Yes! If you already have one, just select it instead of creating new

**Q: What if instance fails to launch?**
A: Usually wait 2-3 minutes and try again. Check AWS account has access.

---

**Ready? Create your instance now!** 🚀
