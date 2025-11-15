#!/bin/bash
# AWS Flipkart Clone Deployment Script

echo "🚀 FLIPKART CLONE - AWS DEPLOYMENT"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Install from: https://aws.amazon.com/cli/${NC}"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI found${NC}"

# Get AWS credentials
echo ""
echo "Enter your AWS details:"
read -p "AWS Region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Key Pair Name: " KEY_PAIR
if [ -z "$KEY_PAIR" ]; then
    echo -e "${RED}❌ Key Pair name required${NC}"
    exit 1
fi

# Create CloudFormation stack
echo ""
echo -e "${YELLOW}📋 Creating CloudFormation Stack...${NC}"

aws cloudformation create-stack \
    --stack-name flipkart-clone-stack \
    --template-body file://aws-deploy.yaml \
    --parameters ParameterKey=KeyPairName,ParameterValue=$KEY_PAIR \
    --region $AWS_REGION

echo -e "${GREEN}✓ Stack creation initiated${NC}"

# Wait for stack creation
echo ""
echo -e "${YELLOW}⏳ Waiting for stack to complete (this may take 5-10 minutes)...${NC}"

aws cloudformation wait stack-create-complete \
    --stack-name flipkart-clone-stack \
    --region $AWS_REGION

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Stack created successfully!${NC}"
    
    # Get outputs
    echo ""
    echo -e "${GREEN}📊 DEPLOYMENT DETAILS:${NC}"
    aws cloudformation describe-stacks \
        --stack-name flipkart-clone-stack \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs' \
        --output table
    
    # Get IP
    ELASTIC_IP=$(aws cloudformation describe-stacks \
        --stack-name flipkart-clone-stack \
        --region $AWS_REGION \
        --query 'Stacks[0].Outputs[?OutputKey==`ElasticIP`].OutputValue' \
        --output text)
    
    echo ""
    echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
    echo ""
    echo "📱 Access your site:"
    echo -e "${YELLOW}http://$ELASTIC_IP:3000${NC}"
    echo ""
    echo "🔑 SSH to instance:"
    echo -e "${YELLOW}ssh -i your-key.pem ec2-user@$ELASTIC_IP${NC}"
    
else
    echo -e "${RED}❌ Stack creation failed${NC}"
    exit 1
fi
