# Deploy to AWS (ECS Fargate) — af-south-1 (Cape Town)

This repository includes a GitHub Actions workflow to build the Docker image, push it to ECR, register a new ECS task definition, and update an existing ECS Service.

Important: I cannot deploy to your AWS account without credentials. The workflow is prepared; to run the deployment automatically you must:

1) Create an IAM user with these minimal permissions (attach a policy with these actions) and save the access key/secret for GitHub Secrets:

- ecr:CreateRepository, ecr:DescribeRepositories, ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, ecr:InitiateLayerUpload, ecr:UploadLayerPart, ecr:CompleteLayerUpload, ecr:PutImage
- ecs:RegisterTaskDefinition, ecs:UpdateService, ecs:DescribeServices, ecs:ListTaskDefinitions
- iam:PassRole (for the task execution role if creating via IaC)
- logs:CreateLogGroup, logs:CreateLogStream, logs:PutLogEvents

2) Create ECR repository name you want (or let the workflow create one). Recommended repository name: `flipkart-site`.

3) Add the following GitHub Secrets to your repository (Settings → Secrets):

- `AWS_ACCESS_KEY_ID` — access key from IAM user
- `AWS_SECRET_ACCESS_KEY` — secret from IAM user
- `AWS_REGION` — e.g. `af-south-1`
- `ECR_REPOSITORY` — e.g. `flipkart-site`
- `ECS_CLUSTER` — name of your ECS cluster
- `ECS_SERVICE` — name of your ECS Service
- `ECS_TASK_FAMILY` — task family name, e.g. `flipkart-task`
- Optional: `PUBLIC_URL` — public URL of your ALB or service for health check

4) Make sure an ECS cluster and ECS service already exist and are configured for Fargate with a load balancer (the workflow updates an existing service). If you don't have these, either:

- Create them manually in the AWS Console, or
- Use the AWS CLI (example below) to create a cluster and a simple service (you'll still need a task role & execution role):

  # Example (very small):
  aws ecs create-cluster --cluster-name flipkart-cluster --region af-south-1

  # Create an ECR repo (if you didn't create it in console):
  aws ecr create-repository --repository-name flipkart-site --region af-south-1

5) Push to `main` branch on GitHub and the workflow will run. The actions will:

- Build Docker image
- Push to ECR
- Register task definition (from `ecs-task-def.json` with image filled)
- Update the named ECS service to use the new task definition

Notes and alternatives
- If you prefer I prepare Terraform/CloudFormation to create the ECS cluster & service for you, I can generate those files; you'll still need to apply them with AWS credentials.
- For a simpler setup you can also host the container on other providers (Azure, DigitalOcean). The repo already includes a `Dockerfile` and `docker-compose.yml` for local testing.
