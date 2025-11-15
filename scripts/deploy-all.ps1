<#
Deploys Flipko with zero manual steps:
 - API: Builds Docker image, pushes to ECR, deploys/updates AWS App Runner (port 8080, health /_health)
 - Static: Uploads site to S3 and fronts it with CloudFront (HTTPS). Injects API URL into static.config.js.

Prereqs: AWS CLI v2, Docker, AWS credentials (AdministratorAccess recommended for first run).
Usage (PowerShell 5.1+):
  Set-ExecutionPolicy -Scope Process Bypass; ./scripts/deploy-all.ps1
#>

param(
  [string]$AppName = 'flipko-api',
  [string]$PreferredRegion = 'af-south-1',
  [string]$StaticRegion = 'af-south-1',
  [switch]$AllowRegionFallback,
  [switch]$VerboseLogs
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($VerboseLogs) { $VerbosePreference = 'Continue' } else { $VerbosePreference = 'SilentlyContinue' }

function Ensure-Command {
  param([string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command '$Name' not found in PATH. Please install it and retry."
  }
}

function Install-AwsCli {
  Write-Host "AWS CLI not found. Attempting per-user install..." -ForegroundColor Yellow
  $msiUrl = 'https://awscli.amazonaws.com/AWSCLIV2.msi'
  $msiPath = Join-Path $env:TEMP 'AWSCLIV2.msi'
  try {
    Invoke-WebRequest -Uri $msiUrl -OutFile $msiPath -UseBasicParsing
    $args = "/i `"$msiPath`" /qn ALLUSERS=2 MSIINSTALLPERUSER=1"
    Start-Process -Wait -FilePath msiexec.exe -ArgumentList $args -NoNewWindow
  } catch {
    throw "Failed to download/install AWS CLI: $_"
  }
  # Common install paths
  $candidates = @(
    "$Env:ProgramFiles\Amazon\AWSCLIV2",
    "$Env:LOCALAPPDATA\Programs\Amazon\AWSCLIV2",
    "$Env:LOCALAPPDATA\Amazon\AWSCLI"
  )
  foreach ($dir in $candidates) {
    $exe = Join-Path $dir 'aws.exe'
    if (Test-Path $exe) {
      $env:PATH = "$dir;$env:PATH"
      return
    }
  }
}

function Json {
  param([Parameter(Mandatory)][object]$Obj)
  return ($Obj | ConvertTo-Json -Depth 100 -Compress)
}

Write-Host "Checking tools..." -ForegroundColor Cyan
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  Install-AwsCli
}
Ensure-Command aws
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "Docker not found. Attempting to install Docker Desktop via winget..." -ForegroundColor Yellow
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    try {
      winget install -e --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements
    } catch {
      Write-Host "winget install failed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/ and rerun." -ForegroundColor Red
      throw
    }
  } else {
    Write-Host "winget not available. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/ and rerun." -ForegroundColor Red
    throw "Docker not installed."
  }
}
Ensure-Command docker
try { docker version | Out-Null } catch {
  $dockerApp = Join-Path $Env:ProgramFiles 'Docker\Docker\Docker Desktop.exe'
  if (Test-Path $dockerApp) { Start-Process -FilePath $dockerApp -WindowStyle Minimized | Out-Null }
  Write-Host "Waiting for Docker engine to be ready..." -ForegroundColor DarkGray
  for ($i=0; $i -lt 60; $i++) { Start-Sleep -Seconds 5; try { docker version | Out-Null; break } catch { } }
}

Write-Host "Resolving AWS account..." -ForegroundColor Cyan
try {
  $who = aws sts get-caller-identity | ConvertFrom-Json
} catch {
  Write-Host "AWS credentials not configured. You'll be prompted now (region: af-south-1)." -ForegroundColor Yellow
  aws configure
  $who = aws sts get-caller-identity | ConvertFrom-Json
}
if (-not $who.Account) { throw 'Unable to resolve AWS account. Re-run and complete aws configure.' }
$AccountId = $who.Account

function Test-AppRunner-Region {
  param([string]$Region)
  try {
    aws apprunner list-services --region $Region | Out-Null
    return $true
  } catch {
    return $false
  }
}

$Region = $PreferredRegion
if (-not (Test-AppRunner-Region -Region $Region)) {
  if ($AllowRegionFallback) {
    Write-Host "App Runner not available in $Region and fallback allowed. Using eu-west-1." -ForegroundColor Yellow
    $Region = 'eu-west-1'
  } else {
    Write-Host "App Runner is not available in $Region. Falling back to ECS Fargate in-region." -ForegroundColor Yellow
    $useEcsFallback = $true
  }
} else { $useEcsFallback = $false }

if (-not $useEcsFallback) {
  # --- Build and Push image to ECR (App Runner path) ---
  Write-Host "Preparing ECR in $Region..." -ForegroundColor Cyan
  aws ecr create-repository --repository-name $AppName --region $Region 2>$null | Out-Null
  docker logout "$AccountId.dkr.ecr.$Region.amazonaws.com" *>$null
  aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com" | Out-Null

  $RepoUri = "$AccountId.dkr.ecr.$Region.amazonaws.com/$AppName"
  $Tag = "latest"
  Write-Host "Building Docker image $($AppName):$Tag..." -ForegroundColor Cyan
  docker build -t "$($AppName):latest" .
  docker tag "$($AppName):latest" "$($RepoUri):$Tag"
  Write-Host "Pushing to $($RepoUri):$Tag..." -ForegroundColor Cyan
  docker push "$($RepoUri):$Tag"

  # --- Create or Update App Runner ---
  Write-Host "Deploying App Runner service..." -ForegroundColor Cyan
  $svcArn = $null
  $services = aws apprunner list-services --region $Region | ConvertFrom-Json
  $existing = $services.ServiceSummaryList | Where-Object { $_.ServiceName -eq $AppName } | Select-Object -First 1

  $imageConfig = @{ Port = '8080'; RuntimeEnvironmentVariables = @(@{ Name = 'HOST_REGION'; Value = $PreferredRegion }, @{ Name = 'PORT'; Value = '8080' }) }
  $sourceConfig = @{ ImageRepository = @{ ImageIdentifier = "$($RepoUri):$Tag"; ImageRepositoryType = 'ECR'; ImageConfiguration = $imageConfig }; AutoDeploymentsEnabled = $true }
  $healthCfg = @{ Protocol = 'HTTP'; Path = '/_health'; HealthyThreshold = 1; UnhealthyThreshold = 3; Interval = 5; Timeout = 2 }

  if ($null -ne $existing) {
    $svcArn = $existing.ServiceArn
    Write-Host "Updating existing App Runner service $($existing.ServiceName)..." -ForegroundColor Yellow
    aws apprunner update-service --region $Region --service-arn $svcArn --source-configuration (Json $sourceConfig) --health-check-configuration (Json $healthCfg) | Out-Null
  } else {
    Write-Host "Creating new App Runner service $AppName..." -ForegroundColor Cyan
    $created = aws apprunner create-service --region $Region --service-name $AppName --source-configuration (Json $sourceConfig) --health-check-configuration (Json $healthCfg) | ConvertFrom-Json
    $svcArn = $created.Service.ServiceArn
  }

  function Get-Service {
    param([string]$Arn)
    return (aws apprunner describe-service --region $Region --service-arn $Arn | ConvertFrom-Json).Service
  }

  Write-Host "Waiting for App Runner to be RUNNING..." -ForegroundColor Cyan
  for ($i=0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 5
    $svc = Get-Service -Arn $svcArn
    $status = $svc.Status
    Write-Host "  Status: $status" -ForegroundColor DarkGray
    if ($status -eq 'RUNNING') { break }
  }
  $apiUrl = (Get-Service -Arn $svcArn).ServiceUrl
  if (-not $apiUrl) { throw 'Failed to obtain App Runner URL.' }
  Write-Host "API ready: $apiUrl" -ForegroundColor Green
}

# --- ECS Fargate fallback (in-region) ---
if ($useEcsFallback) {
  Write-Host "Using ECS Fargate fallback in $Region..." -ForegroundColor Yellow
  # Ensure Terraform
  if (-not (Get-Command terraform -ErrorAction SilentlyContinue)) {
    Write-Host "Terraform not found. Attempting to install via winget..." -ForegroundColor Yellow
    if (Get-Command winget -ErrorAction SilentlyContinue) {
      winget install -e --id HashiCorp.Terraform --accept-source-agreements --accept-package-agreements
    } else { throw "Terraform is required. Install from https://developer.hashicorp.com/terraform/install" }
  }
  $tfDir = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'deploy' | Join-Path -ChildPath 'terraform'
  Push-Location $tfDir
  try {
    terraform init -input=false
    terraform apply -auto-approve -input=false -var "aws_region=$Region"
    $tfout = terraform output -json | ConvertFrom-Json
  } finally { Pop-Location }

  $RepoUri = $tfout.ecr_repo_url.value
  $albDns  = $tfout.alb_dns_name.value
  $cluster = $tfout.ecs_cluster.value
  $svcName = if ($tfout.PSObject.Properties.Name -contains 'ecs_service_name') { $tfout.ecs_service_name.value } else { 'flipkart-service' }

  $Tag = 'latest'
  Write-Host "Building Docker image $($AppName):$Tag..." -ForegroundColor Cyan
  docker build -t "$($AppName):latest" .
  docker tag "$($AppName):latest" "$($RepoUri):$Tag"
  Write-Host "Logging in to ECR and pushing image..." -ForegroundColor Cyan
  aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$($RepoUri.Split('/')[0])" | Out-Null
  docker push "$($RepoUri):$Tag"

  Write-Host "Forcing new ECS deployment..." -ForegroundColor Cyan
  aws ecs update-service --cluster $cluster --service $svcName --force-new-deployment --region $Region | Out-Null

  $apiUrl = "http://$albDns"
  Write-Host "API ready via ALB: $apiUrl" -ForegroundColor Green
}

# --- Static site: S3 + CloudFront ---
Write-Host "Preparing static website (S3 + CloudFront)..." -ForegroundColor Cyan
$BucketSuffix = (Get-Random -Maximum 999999).ToString('000000')
$Bucket = "flipko-static-$BucketSuffix"

# Create bucket
if ($StaticRegion -eq 'us-east-1') {
  aws s3api create-bucket --bucket $Bucket --region $StaticRegion 2>$null | Out-Null
} else {
  aws s3api create-bucket --bucket $Bucket --region $StaticRegion --create-bucket-configuration LocationConstraint=$StaticRegion 2>$null | Out-Null
}

# Prepare temp static build with injected API base
$tmp = New-Item -ItemType Directory -Path (Join-Path $env:TEMP ("flipko-static-" + [guid]::NewGuid()))
Write-Host "Staging static files in $($tmp.FullName) ..." -ForegroundColor DarkGray

# Copy selected files/folders
Copy-Item -Recurse -Force -Path "$(Join-Path $PSScriptRoot '..' 'index.html')" -Destination $tmp
Copy-Item -Recurse -Force -Path "$(Join-Path $PSScriptRoot '..' 'style.css')" -Destination $tmp -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force -Path "$(Join-Path $PSScriptRoot '..' 'script.js')" -Destination $tmp -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force -Path "$(Join-Path $PSScriptRoot '..' 'Flipkart')" -Destination $tmp

# Generate static.config.js with API base
$staticCfg = "// Generated by deploy-all.ps1`nwindow.API_BASE = '$apiUrl';`n"
Set-Content -NoNewline -Path (Join-Path $tmp.FullName 'static.config.js') -Value $staticCfg -Encoding UTF8

# Upload to S3
aws s3 sync $tmp.FullName "s3://$Bucket/" --region $StaticRegion --delete | Out-Null

# Create CloudFront Origin Access Control
$oacName = "oac-$Bucket"
$oacCfg = @{ Name=$oacName; Description="OAC for $Bucket"; SigningProtocol='sigv4'; SigningBehavior='always'; OriginAccessControlOriginType='s3' }
$oac = aws cloudfront create-origin-access-control --origin-access-control-config (Json $oacCfg) | ConvertFrom-Json
$oacId = $oac.OriginAccessControl.Id

# Build distribution config
$s3RegionalDomain = "$Bucket.s3.$StaticRegion.amazonaws.com"
$cfCfg = @{ 
  CallerReference = (Get-Date).Ticks.ToString();
  Comment = "Flipko static via $Bucket";
  Enabled = $true;
  PriceClass = 'PriceClass_100';
  DefaultRootObject = 'index.html';
  Origins = @{ Items = @(@{
    Id = "S3-$Bucket";
    DomainName = $s3RegionalDomain;
    S3OriginConfig = @{ OriginAccessIdentity = '' };
    OriginAccessControlId = $oacId;
  }); Quantity = 1 };
  DefaultCacheBehavior = @{ 
    TargetOriginId = "S3-$Bucket";
    ViewerProtocolPolicy = 'redirect-to-https';
    AllowedMethods = @{ Items = @('GET','HEAD'); Quantity = 2 };
    CachedMethods = @{ Items = @('GET','HEAD'); Quantity = 2 };
    Compress = $true;
    ForwardedValues = @{ QueryString = $false; Cookies = @{ Forward = 'none' } };
    MinTTL = 0; DefaultTTL = 3600; MaxTTL = 86400;
  };
  ViewerCertificate = @{ CloudFrontDefaultCertificate = $true };
}

$dist = aws cloudfront create-distribution --distribution-config (Json $cfCfg) | ConvertFrom-Json
$distId = $dist.Distribution.Id
$distArn = $dist.Distribution.ARN
$cfDomain = $dist.Distribution.DomainName

# Attach bucket policy to allow CloudFront OAC access via distribution ARN
$policy = @{ 
  Version = '2012-10-17';
  Statement = @(
    @{ Sid='AllowCloudFrontServicePrincipalReadOnly'; Effect='Allow'; Principal=@{ Service='cloudfront.amazonaws.com' };
       Action=@('s3:GetObject'); Resource=@("arn:aws:s3:::$Bucket/*"); Condition=@{ StringEquals=@{ 'AWS:SourceArn'=$distArn } } }
  )
}
aws s3api put-bucket-policy --bucket $Bucket --policy (Json $policy) | Out-Null

Write-Host "Waiting for CloudFront distribution to deploy (this can take minutes)..." -ForegroundColor Cyan
for ($i=0; $i -lt 120; $i++) {
  Start-Sleep -Seconds 10
  $st = aws cloudfront get-distribution --id $distId | ConvertFrom-Json
  $status = $st.Distribution.Status
  Write-Host "  CloudFront: $status" -ForegroundColor DarkGray
  if ($status -eq 'Deployed') { break }
}

Write-Host "Deployment complete." -ForegroundColor Green
Write-Host "API URL:    $apiUrl" -ForegroundColor Green
Write-Host "Website URL: https://$cfDomain" -ForegroundColor Green

Write-Host "Tip: Update your bookmarks to the CloudFront domain for instant loads." -ForegroundColor DarkCyan
