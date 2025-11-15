Deploying with GitHub OIDC (recommended)
=======================================

This document explains how to use the included CloudFormation template `cloudformation/oidc-github-role.yaml` to create an IAM Role that GitHub Actions can assume via OIDC (no long-lived AWS keys required).

1) Deploy the OIDC role stack (one-time, admin action)

Using AWS Console:
- Open CloudFormation in `af-south-1`, create a new stack, upload `cloudformation/oidc-github-role.yaml`.
- For `GitHubRepository` parameter enter `owner/repo` (e.g. `myorg/myrepo`).
- Create the stack and wait until `CREATE_COMPLETE`.
- Copy the `DeployRoleArn` output.

Using AWS CLI:

```bash
aws cloudformation deploy --template-file cloudformation/oidc-github-role.yaml --stack-name flipkart-oidc --parameter-overrides GitHubRepository=owner/repo --region af-south-1
```

After completion, retrieve the Role ARN:

```bash
aws cloudformation describe-stacks --stack-name flipkart-oidc --region af-south-1 --query 'Stacks[0].Outputs' --output json
```

2) Add GitHub repository secret
- In your GitHub repository, go to Settings → Secrets → Actions → New repository secret.
- Add `AWS_OIDC_ROLE_ARN` and paste the `DeployRoleArn` value.
- Also make sure you have these secrets present (or keep them from earlier steps): `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`, `ECS_TASK_FAMILY`, and optionally `PUBLIC_URL`.

3) Push to `main` to trigger `.github/workflows/aws-ecs-deploy-oidc.yml`.

Notes
- The OIDC role created includes a trust policy that limits tokens to the provided repository via the `sub` condition. For broader access across multiple repos, adjust the CloudFormation parameter accordingly.
- After OIDC setup, no AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY keys are required in GitHub Secrets.
