# Flipko Render Deployment - EXACT Steps

## ✅ You're logged into Render.com - Follow these EXACT steps:

---

## Step 1: Create New Web Service

Look at the top-right corner of your Render dashboard.

**Click:** The blue **"New +"** button

**Then Click:** **"Web Service"**

---

## Step 2: Choose Deployment Method

You'll see a page asking how to deploy.

**Click:** **"Build and deploy from a Git repository"**

Then at the bottom, you'll see:
**Click:** **"Or, deploy from a public repository"**

---

## Step 3: Public Repository (Temporary)

You'll see a text box asking for a Git repository URL.

**For now, paste this temporary URL:**
```
https://github.com/render-examples/python-sample-app
```

**Click:** **"Connect"**

Don't worry - we'll upload YOUR files in the next step.

---

## Step 4: Configure Your Service

Now you'll see a form with many fields. Fill in EXACTLY as shown:

### Basic Settings:
| Field | What to Type |
|-------|-------------|
| **Name** | `flipko-store` |
| **Region** | Choose: **Oregon (US West)** or closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave EMPTY |

### Build & Deploy Settings:
| Field | What to Type |
|-------|-------------|
| **Runtime** | Select: **Python 3** from dropdown |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python server_py.py` |

### Instance Settings:
| Field | What to Choose |
|-------|---------------|
| **Instance Type** | Select: **Free** |

**Scroll down and Click:** **"Create Web Service"**

---

## Step 5: Wait for First Build (Will Fail - That's OK!)

Render will try to build the sample app. It will take 1-2 minutes.

You'll see logs scrolling. The build will likely **fail** - that's expected because we need to upload YOUR code.

---

## Step 6: Upload Your Code

### Option A: Manual Deploy (Easier)

1. **Click** on your service name **"flipko-store"** in the left sidebar
2. **Click** the **"Manual Deploy"** dropdown (top right)
3. **Choose:** **"Deploy latest commit"** (this might not work yet)

### Option B: Settings Upload

1. **Click** **"Settings"** tab (top menu)
2. Look for **"Environment Variables"** section
3. We'll configure this next

---

## Step 7: Upload Files via GitHub (Recommended)

Since Render works best with Git, here's the EASIEST way:

### On GitHub (create if you don't have account):
1. Go to: https://github.com/new
2. Repository name: `flipko-store`
3. Make it **Public**
4. **DON'T** check "Add README"
5. Click: **"Create repository"**

### Copy the upload URL GitHub shows you

Then tell me: **"I created the GitHub repo"** and I'll give you the exact commands to upload your code.

---

## Step 8: Reconnect Render to YOUR GitHub Repo

1. In Render, click **"Settings"** tab
2. Scroll to **"Build & Deploy"**
3. Find **"Repository"** section
4. **Click:** **"Disconnect"** (if needed)
5. **Click:** **"Connect Repository"**
6. Choose your GitHub account
7. Select: **`flipko-store`** repository

---

## Step 9: Deploy!

After connecting your repo:
1. **Click:** **"Manual Deploy"** dropdown (top right)
2. **Choose:** **"Deploy latest commit"**

Wait 2-3 minutes for build to complete.

---

## Step 10: Get Your Link!

When deployment succeeds, you'll see:
- Green "Live" badge
- Your URL at the top: `https://flipko-store.onrender.com`

**Your shareable link:**
```
https://flipko-store.onrender.com/Flipkart/index.html
```

---

## 🆘 Where Are You Now?

Tell me which step you're on and I'll help you with the exact next action!

Options:
1. **"I'm at the dashboard"** - I'll tell you what to click
2. **"I'm creating the service"** - I'll verify your settings
3. **"I need GitHub help"** - I'll set up Git commands for you
4. **"I'm stuck at [step]"** - I'll troubleshoot

What do you see on your screen right now?
