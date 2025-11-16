# 🚀 Deploy Flipkart Clone to Render in 5 Minutes

## **Step-by-Step Instructions (Copy & Paste)**

### **Step 1: Sign Up on Render (1 minute)**
1. Go to: https://render.com
2. Click **"Sign up"**
3. Click **"Continue with GitHub"**
4. Authorize Render to access your GitHub account
5. Click **"Install"** to authorize

### **Step 2: Create New Web Service (2 minutes)**
1. Click **"New +"** (top right)
2. Click **"Web Service"**
3. **Select Repository:** 
   - Search for: `flipkart-clone`
   - Click the repo: `urbancartcomshop-ui/flipkart-clone`
4. Click **"Connect"**

### **Step 3: Configure Service (2 minutes)**
Fill in these exact settings:

| Field | Value |
|-------|-------|
| **Name** | `flipkart-clone` |
| **Environment** | `Node` |
| **Build Command** | `npm ci` |
| **Start Command** | `node index.js` |
| **Plan** | `Free` |
| **Region** | `Singapore` or `Oregon` |

### **Step 4: Deploy (1 click)**
Click **"Create Web Service"**

That's it! Render will:
- ✅ Clone your GitHub repo
- ✅ Install dependencies
- ✅ Start your server
- ✅ Give you a live URL

### **Step 5: Wait for Deployment**
- Build takes **2-3 minutes**
- You'll see logs in real-time
- When complete, you get a URL like:
  ```
  https://flipkart-clone-xxxx.onrender.com
  ```

### **After Deployment is Live**
- Your site is now accessible worldwide
- Auto-deploys on every GitHub push
- Logs available in Render dashboard

---

## **Your Live Flipkart Clone Will Be At:**
```
https://flipkart-clone-[random-id].onrender.com
```

## **Troubleshooting**

If build fails:
1. Check **Logs** tab in Render dashboard
2. Common issues:
   - Node version: We set it to 20 in `.nvmrc`
   - Port: Render assigns port automatically
   - Dependencies: `npm ci` installs from `package-lock.json`

---

**Questions? The Render UI is very intuitive—just follow the 5 steps above!**
