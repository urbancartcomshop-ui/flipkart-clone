#!/usr/bin/env node

/**
 * Flipkart Clone - Vercel Deployment Script
 * This script handles deployment to Vercel production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║   🚀 FLIPKART CLONE - VERCEL DEPLOYMENT SCRIPT            ║
╚═══════════════════════════════════════════════════════════╝
`);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('\n📋 Checking Prerequisites...', 'cyan');

  // Check if vercel is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log('✅ Vercel CLI installed', 'green');
  } catch (err) {
    log('❌ Vercel CLI not installed. Installing...', 'yellow');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Check if git is installed
  try {
    execSync('git --version', { stdio: 'pipe' });
    log('✅ Git installed', 'green');
  } catch (err) {
    log('❌ Git not installed', 'yellow');
    process.exit(1);
  }

  // Check if node_modules exists
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('📦 Installing dependencies...', 'yellow');
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  } else {
    log('✅ Dependencies installed', 'green');
  }
}

function verifyDeploymentFiles() {
  log('\n📁 Verifying Deployment Files...', 'cyan');

  const requiredFiles = [
    'public/vercel-homepage.html',
    'public/product.html',
    'public/products.json',
    'public/sitemap.xml',
    'public/robots.txt',
    'public/404.html',
    'vercel.json',
    'package.json'
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} - MISSING`, 'yellow');
      allFilesExist = false;
    }
  }

  if (!allFilesExist) {
    log('\n⚠️  Some files are missing. Deployment may fail.', 'yellow');
  }

  return allFilesExist;
}

function commitChanges() {
  log('\n📝 Committing Changes to GitHub...', 'cyan');

  try {
    const status = execSync('git status --short', { encoding: 'utf8' });
    
    if (status.trim()) {
      log('Changes detected. Committing...', 'yellow');
      execSync('git add -A', { stdio: 'inherit' });
      execSync('git commit -m "Pre-deployment: Updated files for Vercel deployment"', { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      log('✅ Changes committed and pushed', 'green');
    } else {
      log('✅ No changes to commit', 'green');
    }
  } catch (err) {
    log('⚠️  Git operation failed. Continuing...', 'yellow');
  }
}

function deployToVercel() {
  log('\n🚀 Deploying to Vercel...', 'cyan');

  try {
    // Set environment variables
    process.env.VERCEL_ORG_ID = process.env.VERCEL_ORG_ID || '';
    process.env.VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || '';

    log('Executing: vercel --prod --yes', 'blue');
    log('(This may take 1-2 minutes)', 'yellow');
    
    const deployOutput = execSync('vercel --prod --yes 2>&1', { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    console.log(deployOutput);
    log('✅ Deployment to Vercel complete!', 'green');
    
    return deployOutput;
  } catch (err) {
    if (err.message.includes('Project names can')) {
      log('\n⚠️  Project naming issue detected', 'yellow');
      log('Solution: Deploy via Vercel Dashboard instead', 'yellow');
      log('Steps:', 'cyan');
      log('1. Go to https://vercel.com', 'cyan');
      log('2. Click "New Project"', 'cyan');
      log('3. Import your GitHub repository', 'cyan');
      log('4. Select "public" as root directory', 'cyan');
      log('5. Deploy!', 'cyan');
      return null;
    }
    throw err;
  }
}

function postDeploymentChecks() {
  log('\n✅ Post-Deployment Checklist', 'cyan');

  log(`
📋 Please verify the following:

1. ✓ Homepage loads correctly
2. ✓ All 32 products display
3. ✓ Product images load (160 images)
4. ✓ Product detail page works
5. ✓ Shopping cart functions
6. ✓ Mobile responsive design
7. ✓ sitemap.xml accessible
8. ✓ robots.txt accessible
9. ✓ 404 page displays on invalid URL
10. ✓ No console errors

📊 Monitoring:

Use the following to monitor your deployment:

1. Vercel Dashboard: https://vercel.com/dashboard
2. Analytics: https://vercel.com/analytics
3. Environment Variables: https://vercel.com/settings
4. Deployments: Check logs for any errors

🔧 Next Steps:

1. Set up custom domain (optional)
2. Configure Google Analytics
3. Enable real-time logs
4. Set up error tracking (Sentry)
5. Monitor performance metrics

📚 Documentation Files:

- DEPLOYMENT_COMPLETE.md
- POST_DEPLOYMENT_CHECKLIST.md
- monitoring-setup.js
- post-deployment-setup.js
  `, 'bright');
}

function main() {
  try {
    checkPrerequisites();
    verifyDeploymentFiles();
    commitChanges();
    const result = deployToVercel();
    
    if (result) {
      postDeploymentChecks();
      
      log('\n' + '='.repeat(55), 'green');
      log('🎉 DEPLOYMENT SUCCESSFUL!', 'green');
      log('='.repeat(55), 'green');
      
      log('\n📱 Your site is now live on Vercel!', 'bright');
      log('🌍 Visit: https://your-project.vercel.app', 'bright');
      
    } else {
      log('\n⚠️  Deployment requires manual setup', 'yellow');
      log('Please deploy via Vercel Dashboard', 'yellow');
    }

  } catch (err) {
    log(`\n❌ Error: ${err.message}`, 'yellow');
    log('\n💡 Troubleshooting:', 'cyan');
    log('1. Check Node.js is installed: node --version', 'cyan');
    log('2. Check npm is installed: npm --version', 'cyan');
    log('3. Verify Vercel CLI: vercel --version', 'cyan');
    log('4. Check GitHub connection: git remote -v', 'cyan');
    log('5. Try deploying via Vercel Dashboard manually', 'cyan');
    process.exit(1);
  }
}

// Run the script
main();
