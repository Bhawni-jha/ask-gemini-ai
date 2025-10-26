# 🚀 Deployment Guide - Ask Gemini AI

This guide will help you deploy your Ask Gemini AI app to various platforms.

## 📋 Table of Contents
- [Vercel (Recommended)](#vercel-deployment)
- [Render](#render-deployment)
- [Railway](#railway-deployment)
- [Important Security Notes](#security-notes)

---

## 🔷 Vercel Deployment

Vercel is perfect for Node.js applications and offers free hosting with automatic deployments.

### Step 1: Prepare Your Project

Your project is already configured for Vercel! The `vercel.json` file handles the setup.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in (use GitHub login)

2. **Import Your Repository**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Find and select `ask-gemini-ai` repository

3. **Configure Build Settings**
   - Vercel will auto-detect it's a Node.js project
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (or `npm install`)
   - **Output Directory**: Leave as `.`
   - **Install Command**: `npm install`

4. **Add Environment Variables** ⚠️ **CRITICAL STEP**
   - Click on "Environment Variables"
   - Add the following:
     ```
     Name: GEMINI_API_KEY
     Value: AIzaSyB72WcfvIpty8msyUeWiK2FajhGMAxY25E
     ```
   - Add another one:
     ```
     Name: PORT
     Value: 4000
     ```
   - Select all environments: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at: `https://your-project-name.vercel.app`

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
cd /home/navgurukul/Desktop/gemini/gemini-int
vercel

# Follow prompts and add environment variables when asked
```

### Step 3: Add Environment Variables (If Not Done During Setup)

1. Go to your project dashboard on Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Add your variables:
   - `GEMINI_API_KEY` = Your actual API key
   - `PORT` = 4000
5. Click "Save"
6. Redeploy: Go to "Deployments" tab → Click "..." on latest → "Redeploy"

---

## 🔷 Render Deployment

Render offers free hosting for web services.

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up using GitHub

### Step 2: Create New Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `Bhawni-jha/ask-gemini-ai`
3. Configure:
   - **Name**: `ask-gemini-ai`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

1. Scroll down to "Environment Variables"
2. Click "Add Environment Variable"
3. Add:
   ```
   GEMINI_API_KEY = AIzaSyB72WcfvIpty8msyUeWiK2FajhGMAxY25E
   PORT = 4000
   ```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Your app will be live at: `https://ask-gemini-ai.onrender.com`

---

## 🔷 Railway Deployment

Railway provides simple deployment with automatic scaling.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy from GitHub

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `Bhawni-jha/ask-gemini-ai`

### Step 3: Add Environment Variables

1. Click on your service
2. Go to "Variables" tab
3. Click "New Variable"
4. Add:
   ```
   GEMINI_API_KEY = AIzaSyB72WcfvIpty8msyUeWiK2FajhGMAxY25E
   PORT = 4000
   ```

### Step 4: Deploy

1. Railway auto-deploys on git push
2. Find your URL in "Settings" → "Domains"
3. Click "Generate Domain"

---

## 🔒 Security Notes

### ⚠️ IMPORTANT: API Key Exposed on GitHub

Your API key was accidentally committed to `.env.example`. Here's what to do:

#### Immediate Actions Required:

1. **Regenerate Your API Key** (Recommended)
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Delete the old key: `AIzaSyB72WcfvIpty8msyUeWiK2FajhGMAxY25E`
   - Create a new API key
   - Update it in your deployment platform

2. **Remove from Git History** (Optional but recommended)
   ```bash
   # Install git filter-repo
   pip install git-filter-repo
   
   # Remove sensitive data from history
   cd /home/navgurukul/Desktop/gemini/gemini-int
   git filter-repo --path .env.example --invert-paths
   
   # Force push (⚠️ This rewrites history)
   git push origin main --force
   ```

3. **Verify .env.example is Clean**
   - Check that `.env.example` only contains `your_api_key_here`
   - Never commit actual API keys to `.env.example`

### Best Practices:

✅ **DO:**
- Keep API keys in `.env` (ignored by git)
- Use `.env.example` as a template with placeholder values
- Add environment variables in deployment dashboard
- Regenerate keys if accidentally exposed

❌ **DON'T:**
- Never commit `.env` to git
- Never put real API keys in `.env.example`
- Don't share API keys in public repositories

---

## 🎯 Testing Your Deployment

After deployment, test your app:

1. **Open your deployed URL**
2. **Check console for errors** (F12 → Console tab)
3. **Test a query**: "What is AI?"
4. **Verify API key works**: Should get response with sources

### Common Issues:

#### "API Key Missing" Error
- ✅ Check environment variables in dashboard
- ✅ Ensure variable name is exactly `GEMINI_API_KEY`
- ✅ Redeploy after adding variables

#### "Cannot GET /" Error
- ✅ Check build logs for errors
- ✅ Ensure `server.js` is starting correctly
- ✅ Verify PORT is set correctly

#### 504 Timeout
- ✅ Check if API key is valid
- ✅ Verify Gemini API is accessible from deployment region
- ✅ Check server logs for detailed errors

---

## 📊 Monitoring Your Deployment

### Vercel
- Dashboard → Your Project → "Logs" tab
- See real-time requests and errors

### Render
- Dashboard → Your Service → "Logs" tab
- Monitor server startup and requests

### Railway
- Project → Service → "Deployments" → View logs
- Real-time log streaming

---

## 🔄 Updating Your Deployment

After making changes to your code:

```bash
# Commit changes
git add .
git commit -m "Your update description"

# Push to GitHub
git push origin main
```

**Vercel/Railway**: Auto-deploys on git push  
**Render**: Auto-deploys on git push (if enabled)

---

## 🆘 Need Help?

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Open an issue in your repository

---

## 🎉 Success Checklist

- [ ] Deployed to hosting platform
- [ ] Environment variables added correctly
- [ ] App loads without errors
- [ ] AI responds to queries
- [ ] Sources are displayed
- [ ] Conversation memory works
- [ ] Mobile responsive design works
- [ ] Old API key regenerated (if exposed)

---

**Congratulations on deploying your AI app!** 🚀

For any deployment issues, check the logs first - they usually contain helpful error messages.
