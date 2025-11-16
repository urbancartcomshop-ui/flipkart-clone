# 🚀 Deploy to Heroku (FREE Alternative)

**Heroku is free and has built-in GitHub integration!**

## ⚡ Quick Deploy (3 Minutes)

### Step 1: Create Heroku Account
- Go to https://www.heroku.com
- Sign up (free account)
- Verify email

### Step 2: Connect GitHub
1. Go to Dashboard
2. Click "New" → "Create new app"
3. Name: `flipkart-clone`
4. Region: Select closest to you
5. Click "Create app"

### Step 3: Enable GitHub Deploy
1. Go to "Deploy" tab
2. Click "Connect to GitHub"
3. Authorize Heroku
4. Search: "flipkart-clone"
5. Click "Connect"

### Step 4: Deploy
1. Click "Deploy Branch"
2. Wait for deployment (2-3 minutes)
3. Click "Open app" to view live site! 🎉

---

## ✅ What You Get (FREE)

✅ 550 free dyno hours/month
✅ Auto-deploys on push
✅ Global CDN
✅ Free SSL/HTTPS
✅ Automatic restarts
✅ Scale up anytime

---

## 🔧 Environment Variables (Optional)

If needed, add env vars:
1. Go to Settings tab
2. Click "Reveal Config Vars"
3. Add:
   - `PORT` = 3000
   - `NODE_ENV` = production

---

## 🔗 Your Live URL

After deployment:
```
https://flipkart-clone.herokuapp.com
```

Or custom domain (paid feature).

---

## 🆘 Troubleshooting

### Deployment fails?
1. Check Procfile: `web: node index.js`
2. View logs: `heroku logs --tail`
3. Check buildpack: Should be Node.js

### App crashes?
1. Check Node version
2. View error logs
3. Restart dyno in dashboard

---

## 📖 Resources

- Heroku Docs: https://devcenter.heroku.com
- Node.js Guide: https://devcenter.heroku.com/articles/nodejs-support

---

**Deploy now → https://www.heroku.com** 🚀
