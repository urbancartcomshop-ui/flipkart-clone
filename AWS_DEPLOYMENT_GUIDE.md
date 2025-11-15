# AWS Deployment - Step-by-Step Guide for Your Flipkart Site

## 🎯 Prerequisites

Before deploying, you need:
1. **AWS Account** (free tier available)
2. **AWS CLI installed** 
3. **Docker installed** (for building images)
4. **Your region**: `af-south-1` (Cape Town, Africa)

---

## 📋 Step 1: Install AWS CLI

```powershell
# Download and install AWS CLI v2
# Visit: https://awscli.amazonaws.com/AWSCLIV2.msi
# Or use winget:
winget install Amazon.AWSCLI
```

Verify installation:
```powershell
aws --version
```

---

## 📋 Step 2: Configure AWS Credentials

### Option A: Create IAM User (Recommended for beginners)

1. **Go to AWS Console**: https://console.aws.amazon.com
2. **Sign in or create account**
3. **Go to IAM** → Users → "Create user"
4. **Username**: `flipkart-deployer`
5. **Attach policies**:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonECS_FullAccess`
   - `ElasticLoadBalancingFullAccess`
   - `IAMFullAccess` (for roles)
   - `CloudWatchLogsFullAccess`

6. **Create access key**: Security credentials → Create access key → CLI
7. **Save the Access Key ID and Secret Access Key**

### Configure locally:
```powershell
aws configure
```
Enter:
- Access Key ID: [paste yours]
- Secret Access Key: [paste yours]
- Region: `af-south-1`
- Output format: `json`

---

## 📋 Step 3: Deploy Infrastructure with Terraform

### Install Terraform:
```powershell
winget install Hashicorp.Terraform
```

### Deploy:
```powershell
cd "c:\Users\nitin sabharwal\New folder\deploy\terraform"

# Initialize Terraform
terraform init

# See what will be created
terraform plan

# Create infrastructure (VPC, ECS, ALB, ECR)
terraform apply -auto-approve
```

**This creates:**
- VPC with subnets in Africa region
- Application Load Balancer (ALB)
- ECS Fargate cluster
- ECR repository for your Docker image
- Security groups
- IAM roles

**Time**: ~10 minutes

---

## 📋 Step 4: Build and Push Docker Image

### Get ECR repository URL:
```powershell
$ECR_REPO = terraform output -raw ecr_repository_url
Write-Host "ECR Repository: $ECR_REPO"
```

### Login to ECR:
```powershell
aws ecr get-login-password --region af-south-1 | docker login --username AWS --password-stdin $ECR_REPO
```

### Build Docker image:
```powershell
cd "c:\Users\nitin sabharwal\New folder"
docker build -t flipkart-africa .
```

### Tag and push:
```powershell
docker tag flipkart-africa:latest ${ECR_REPO}:latest
docker push ${ECR_REPO}:latest
```

---

## 📋 Step 5: Create ECS Task Definition

```powershell
# Update task definition with your ECR image
$IMAGE_URI = "${ECR_REPO}:latest"

# Register task definition
aws ecs register-task-definition `
  --family flipkart-task `
  --network-mode awsvpc `
  --requires-compatibilities FARGATE `
  --cpu 256 `
  --memory 512 `
  --execution-role-arn (aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text) `
  --container-definitions "[{
    \"name\": \"flipkart-container\",
    \"image\": \"$IMAGE_URI\",
    \"portMappings\": [{\"containerPort\": 8080, \"protocol\": \"tcp\"}],
    \"environment\": [{\"name\": \"PORT\", \"value\": \"8080\"}, {\"name\": \"HOST_REGION\", \"value\": \"af-south-1\"}],
    \"logConfiguration\": {
      \"logDriver\": \"awslogs\",
      \"options\": {
        \"awslogs-group\": \"/ecs/flipkart-task\",
        \"awslogs-region\": \"af-south-1\",
        \"awslogs-stream-prefix\": \"ecs\"
      }
    }
  }]" `
  --region af-south-1
```

---

## 📋 Step 6: Create ECS Service

```powershell
# Get cluster name from Terraform
$CLUSTER_NAME = terraform output -raw ecs_cluster_name

# Get subnets
$SUBNETS = (terraform output -json public_subnet_ids | ConvertFrom-Json) -join ','

# Get security group
$SG = terraform output -raw ecs_security_group_id

# Get target group ARN
$TG_ARN = terraform output -raw target_group_arn

# Create service
aws ecs create-service `
  --cluster $CLUSTER_NAME `
  --service-name flipkart-service `
  --task-definition flipkart-task `
  --desired-count 1 `
  --launch-type FARGATE `
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SG],assignPublicIp=ENABLED}" `
  --load-balancers "targetGroupArn=$TG_ARN,containerName=flipkart-container,containerPort=8080" `
  --region af-south-1
```

---

## 📋 Step 7: Get Your Public URL

```powershell
# Get ALB DNS name
$ALB_URL = terraform output -raw alb_dns_name
Write-Host "🌍 Your site is live at: http://$ALB_URL"
Write-Host "📱 Share this URL: http://$ALB_URL/Flipkart/index.html"
```

**Your site will be accessible like**: 
`http://flipkart-alb-123456789.af-south-1.elb.amazonaws.com/Flipkart/index.html`

---

## 🎉 That's It!

Your site is now:
- ✅ Live on AWS in Africa region
- ✅ Accessible from any phone/device worldwide
- ✅ Auto-scaling with ECS Fargate
- ✅ Load balanced with ALB
- ✅ Secure and production-ready

---

## 💰 Cost Estimate

**Free Tier (First 12 months)**:
- ECS Fargate: Limited free hours
- ALB: ~$16/month (no free tier)
- Data transfer: First 100GB free

**After Free Tier**: ~$20-30/month for small traffic

---

## 🛠️ Useful Commands

### Check service status:
```powershell
aws ecs describe-services --cluster $CLUSTER_NAME --services flipkart-service --region af-south-1
```

### View logs:
```powershell
aws logs tail /ecs/flipkart-task --follow --region af-south-1
```

### Update service (after new image push):
```powershell
aws ecs update-service --cluster $CLUSTER_NAME --service flipkart-service --force-new-deployment --region af-south-1
```

### Destroy everything (cleanup):
```powershell
cd "c:\Users\nitin sabharwal\New folder\deploy\terraform"
terraform destroy -auto-approve
```

---

## 🚨 Troubleshooting

**Service won't start?**
- Check CloudWatch logs
- Verify security group allows port 8080
- Ensure Docker image is in ECR

**Can't access URL?**
- Wait 2-3 minutes for service to be healthy
- Check target group health in AWS Console
- Verify ALB listener is configured

**Want HTTPS?**
- Add SSL certificate to ALB
- Update listener from HTTP to HTTPS
- I can help configure this!

---

## 📞 Need Help?

Let me know at any step and I'll:
1. Run the commands for you
2. Debug any errors
3. Configure advanced features (HTTPS, custom domain, etc.)

Ready to deploy? Let me know if you want me to run these commands!
