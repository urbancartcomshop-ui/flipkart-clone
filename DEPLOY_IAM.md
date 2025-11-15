# Create IAM user & access keys for GitHub Actions (AWS)

This document explains how to deploy the included CloudFormation template `cloudformation/iam-deploy.yaml` to create an IAM user and an access key that you can add to GitHub Secrets. I cannot create credentials in your AWS account for you; you (or an administrator) must run these steps.

IMPORTANT: The template returns the SecretAccessKey in the CloudFormation outputs. Copy it immediately after stack creation — CloudFormation will not show it again.

Prerequisites
- An AWS account and a user with permission to create CloudFormation stacks and IAM resources (Administrator or equivalent).
- AWS CLI configured locally, or access to the AWS Console.

1) Using the AWS Console (easy)

- Open the CloudFormation console in the desired region (choose `af-south-1` for Cape Town).
- Click **Create stack** → **With new resources (standard)**.
- Under **Specify template**, choose **Upload a template file** and upload `cloudformation/iam-deploy.yaml` from this repo.
- For **Stack name** enter: `flipkart-iam-deploy`.
- For **Parameters** set `GitHubActor` to a short identifier (e.g., your GitHub org or username) to make the IAM username unique.
- Continue and create the stack. Wait for the stack to reach `CREATE_COMPLETE`.
- Open the **Outputs** tab and copy `AccessKeyId` and `SecretAccessKey` values. Save them securely — you'll paste them into GitHub Secrets.

2) Using the AWS CLI

From the project root where this repo is checked out and `cloudformation/iam-deploy.yaml` exists, run:

```powershell
aws cloudformation deploy \
  --template-file cloudformation/iam-deploy.yaml \
  --stack-name flipkart-iam-deploy \
  --parameter-overrides GitHubActor=your-github-id \
  --region af-south-1
```

After the stack completes, retrieve outputs:

```powershell
aws cloudformation describe-stacks --stack-name flipkart-iam-deploy --region af-south-1 --query 'Stacks[0].Outputs' --output json
```

The JSON output will include `AccessKeyId` and `SecretAccessKey` — copy both.

3) Add to GitHub Secrets

- Open your repository on GitHub → Settings → Secrets & variables → Actions → New repository secret.
- Add the following secrets (use the values from step 1 or 2):
  - `AWS_ACCESS_KEY_ID` — value = AccessKeyId
  - `AWS_SECRET_ACCESS_KEY` — value = SecretAccessKey
  - `AWS_REGION` — value = `af-south-1`
  - `ECR_REPOSITORY` — value = your desired ECR repo name (e.g., `flipkart-site`)
  - `ECS_CLUSTER` — name of your ECS cluster
  - `ECS_SERVICE` — name of your ECS service
  - `ECS_TASK_FAMILY` — (e.g., `flipkart-task`)

4) Run the deployment workflow

- Push the changes to the `main` branch (or merge PR) to trigger `.github/workflows/aws-ecs-deploy.yml`.

Security notes
- The access key created is long-lived. After you verify CI deployment works, consider rotating or creating an IAM role with more restrictive scoping, or set an expiry policy and rotate keys periodically.
- The CloudFormation template created a managed policy with `Resource: '*'` for simplicity; for production, scope ARNs to your ECR repo, ECS services, and roles.

If you want, I can instead generate Terraform or CloudFormation that also creates the ECS cluster, task role and service (I will not execute them). Tell me if you'd like full infra-as-code for the entire stack.
