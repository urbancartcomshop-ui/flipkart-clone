Terraform deployment for AWS (ECS + ALB)
=====================================

This folder contains Terraform code to provision an AWS VPC, subnets, ALB, ECR repository, ECS cluster, task definition and service (Fargate) in `af-south-1`.

Important: Running this will create resources that may incur AWS charges. Run in a test account and destroy when finished.

Prerequisites
- Terraform >= 1.0
- AWS CLI configured with credentials that can create resources

Quick start

```bash
cd deploy/terraform
terraform init
terraform apply -auto-approve -var "aws_region=af-south-1" -var "project_name=flipkart"
```

After apply, Terraform will output `alb_dns_name` (public URL) and `ecr_repo_url`.

Next steps
- Build and push Docker image to ECR (use the `ecr_repo_url` output) and tag with `latest`.
- Update the ECS task definition image to point to the pushed image and redeploy the service using Terraform or AWS CLI.

Notes
- This Terraform uses simple defaults for demo purposes. For production, configure more secure networking, IAM policies, autoscaling, and logging.
