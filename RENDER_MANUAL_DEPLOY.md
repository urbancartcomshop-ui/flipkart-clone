# Render Deployment - Manual Steps

Since the Render API requires additional authentication, here's the manual way:

## One-Click Deployment Link (Easiest)

Use this link to deploy directly:
```
https://render.com/deploy?repo=https://github.com/urbancartcomshop-ui/flipkart-clone
```

## Or Manual Steps:

1. **Go to:** https://dashboard.render.com
2. **Click:** New + → Web Service
3. **Connect GitHub** (if not already connected)
4. **Select Repo:** urbancartcomshop-ui/flipkart-clone
5. **Configure:**
   - Name: `flipkart-clone`
   - Environment: `Node`
   - Build Command: `npm ci`
   - Start Command: `node index.js`
   - Plan: `Free`
6. **Click:** Create Web Service

## Expected Timeline:
- Build: 2-3 minutes
- Live URL: https://flipkart-clone-[random].onrender.com

## After Deployment:
- Site auto-deploys on every GitHub push
- View logs in Render dashboard
- Manage environment variables in settings

All necessary files are in your GitHub repo:
- ✓ index.js
- ✓ package.json
- ✓ Procfile
- ✓ render.yaml
- ✓ .nvmrc (Node 20)
- ✓ public/ (all static files)
