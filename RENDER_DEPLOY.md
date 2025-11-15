# Render.com Deployment Guide - Get Your Flipko Site Live!

## 🚀 Quick Deploy to Render.com (5 minutes)

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started" 
3. Sign up with GitHub, Google, or Email (FREE - no credit card needed)

---

### Step 2: Prepare Your Code

We need to create a few files for Render:

**File 1: `requirements.txt`** (Python dependencies)
```
pyOpenSSL==24.0.0
```

**File 2: `render.yaml`** (Render configuration)
```yaml
services:
  - type: web
    name: flipko-store
    env: python
    region: oregon
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: python server_py.py
    envVars:
      - key: PORT
        value: 3000
      - key: HOST_REGION
        value: af-south-1
      - key: LOCATION
        value: Cape Town, South Africa
```

**File 3: Update `server_py.py`** to use Render's PORT

---

### Step 3: Deploy Options

#### Option A: Deploy from GitHub (Recommended)
1. Upload your project to GitHub
2. In Render dashboard: "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will auto-detect Python and deploy
5. Your site will be live at: `https://flipko-store.onrender.com`

#### Option B: Deploy without GitHub
1. In Render dashboard: "New +" → "Web Service"
2. Select "Public Git Repository" or "Upload files"
3. Render will build and deploy
4. Get your URL: `https://flipko-store.onrender.com`

---

### 🎯 Suggested Site Names (Pick One):

- `flipko-store` → https://flipko-store.onrender.com
- `flipko-plus` → https://flipko-plus.onrender.com
- `flipko-mart` → https://flipko-mart.onrender.com
- `flipko-africa` → https://flipko-africa.onrender.com
- `my-flipko-store` → https://my-flipko-store.onrender.com

**Your final shareable link:**
`https://flipko-store.onrender.com/Flipkart/index.html`

---

### 📱 After Deployment:

✅ Share the URL on WhatsApp, Instagram, anywhere!
✅ Works on all phones and devices
✅ Automatic HTTPS (secure)
✅ Free forever (with small limitations)
✅ Auto-restarts if it crashes

---

## ⚡ Want me to set it up for you?

I can create all the necessary files right now. Just tell me:
1. **Which site name do you want?** (e.g., flipko-store)
2. **Do you have a GitHub account?** (yes/no)

Then I'll prepare everything for deployment!
