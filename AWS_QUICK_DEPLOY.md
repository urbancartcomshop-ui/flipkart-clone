# AWS Elastic Beanstalk Deployment Guide

## Quick Deploy (5 Minutes)

### Step 1: Install AWS EB CLI
```powershell
pip install awsebcli
```

### Step 2: Initialize EB
```powershell
cd "c:\Users\nitin sabharwal\New folder"
eb init
```
- Choose region: **us-east-1** (or your preferred region)
- Application name: **flipkart-clone**
- Platform: **Node.js 20**
- Do you want SSH: **No**

### Step 3: Create Environment and Deploy
```powershell
eb create flipkart-production --instance-type t2.micro
```

This will:
- Create an EC2 instance
- Install Node.js 20
- Deploy your application
- Give you a public URL

### Step 4: Open Your Site
```powershell
eb open
```

### Update/Redeploy
```powershell
eb deploy
```

### Monitor Logs
```powershell
eb logs
```

### Check Status
```powershell
eb status
```

### Terminate (When Done)
```powershell
eb terminate flipkart-production
```

## AWS Console Method (No CLI)

1. **Go to**: https://console.aws.amazon.com/elasticbeanstalk
2. **Create Application**
3. **Upload your code as ZIP**:
   - Zip your entire project folder
   - Upload to Elastic Beanstalk
4. **Configure**:
   - Platform: Node.js 20
   - Instance: t2.micro (free tier)
5. **Deploy**

## Cost
- **t2.micro**: FREE for first 12 months
- After free tier: ~$8/month

## Your Site Will Be At:
`http://flipkart-production.us-east-1.elasticbeanstalk.com`
