# AWS Deployment Guide - Flipkart Clone

## 🚀 Deploy to AWS EC2

### Prerequisites
1. AWS Account (with free tier eligible)
2. AWS CLI installed
3. EC2 Key Pair created
4. CloudFormation access

### Quick Deployment Steps

#### Step 1: Create EC2 Key Pair
```bash
# Go to AWS Console → EC2 → Key Pairs → Create Key Pair
# Download and save: my-flipkart-key.pem
# Windows: Set permissions - Right Click → Properties → Security → Advanced
```

#### Step 2: Deploy CloudFormation Stack
```bash
aws cloudformation create-stack \
  --stack-name flipkart-clone-stack \
  --template-body file://aws-deploy.yaml \
  --parameters ParameterKey=KeyPairName,ParameterValue=my-flipkart-key
```

#### Step 3: Wait for Stack Creation
```bash
aws cloudformation describe-stacks \
  --stack-name flipkart-clone-stack \
  --query 'Stacks[0].StackStatus'
```

#### Step 4: Get Instance IP
```bash
aws cloudformation describe-stacks \
  --stack-name flipkart-clone-stack \
  --query 'Stacks[0].Outputs'
```

#### Step 5: SSH into Instance
```bash
ssh -i my-flipkart-key.pem ec2-user@<ELASTIC-IP>
```

#### Step 6: Access Your Application
```
http://<ELASTIC-IP>:3000
```

---

## 📊 What Gets Deployed

✅ VPC (Virtual Private Cloud)
✅ EC2 Instance (t2.micro - Free Tier)
✅ Security Groups (HTTP, HTTPS, SSH)
✅ Elastic IP (Static Public IP)
✅ Node.js Server with all 32 products
✅ 160 Product Images
✅ Complete Flipkart UI

---

## 💰 Cost Estimation (Free Tier)

- **EC2 t2.micro**: FREE (first 12 months)
- **Elastic IP**: FREE when attached
- **Data Transfer**: 1GB FREE/month
- **Total**: ~$0 for first year

---

## 🔧 Alternative: Deploy Manually

If CloudFormation fails, deploy manually:

1. Create EC2 Instance (t2.micro)
2. SSH into instance
3. Run:
```bash
yum update -y
yum install -y nodejs npm git
git clone https://github.com/urbancartcomshop-ui/flipkart-clone.git
cd flipkart-clone
npm install
npm run deploy-server
```

4. Access: `http://<your-elastic-ip>:3000`

---

## 📱 Features Available

- ✅ All 32 products with images
- ✅ Add to cart
- ✅ Checkout page
- ✅ Product details
- ✅ Mobile responsive
- ✅ Cart management
- ✅ Product search & categories

---

## 🛑 Stop & Delete

To avoid charges:

```bash
# Delete stack (removes all resources)
aws cloudformation delete-stack --stack-name flipkart-clone-stack
```

---

## 📞 Troubleshooting

**Instance not starting?**
- Check Security Group allows port 3000
- Verify EC2 role has necessary permissions

**Can't SSH?**
- Ensure key pair permissions correct
- Check Security Group SSH rule (port 22)

**App won't start?**
- SSH in and run: `npm run deploy-server`
- Check logs: `pm2 logs`

---

**Your repo:** https://github.com/urbancartcomshop-ui/flipkart-clone
**Status:** ✅ Ready for AWS deployment
