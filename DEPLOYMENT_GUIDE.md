# 🚀 SecurePass Deployment Guide
# Frontend → Netlify | Backend → Vercel

---

## BEFORE YOU START

You need:
- A **GitHub** account → [github.com](https://github.com)
- A **Vercel** account → [vercel.com](https://vercel.com) (sign up with GitHub)
- A **Netlify** account → [netlify.com](https://netlify.com) (sign up with GitHub)

---

## ═══════════════════════════════════════
## PHASE 1: DEPLOY THE BACKEND (Vercel)
## ═══════════════════════════════════════

### STEP 1: Create a GitHub Repository for Backend

1. Open your browser
2. Go to → https://github.com/new
3. Fill in:
   - Repository name: `securepass-server`
   - Description: `SecurePass Backend API`
   - Select: Public
4. DO NOT check "Add a README file"
5. Click the green **"Create repository"** button
6. You will see a page with setup instructions — **keep this page open**

---

### STEP 2: Push Backend Code to GitHub

Open your **terminal/PowerShell** and run these commands **one at a time**:

```bash
cd "d:\app development\mini proj\securepass\server"
```

```bash
git add .
```

```bash
git commit -m "SecurePass backend ready for deployment"
```

```bash
git branch -M main
```

⚠️ **IMPORTANT**: In the next command, replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/securepass-server.git
```

```bash
git push -u origin main
```

It will ask for your GitHub username and password (or token).
After this, refresh your GitHub page — you should see your server files there.

---

### STEP 3: Deploy Backend on Vercel

1. Open your browser
2. Go to → https://vercel.com
3. Click **"Sign Up"** → Choose **"Continue with GitHub"**
4. After logging in, click **"Add New..."** button (top right) → **"Project"**
5. You will see a list of your GitHub repos
6. Find **"securepass-server"** → Click **"Import"**
7. On the configuration page:
   - **Framework Preset**: Select **"Other"**
   - **Root Directory**: Leave as `./`
   - **Build Command**: Leave **EMPTY** (clear it if anything is there)
   - **Output Directory**: Leave **EMPTY**
8. Click **"Deploy"** button
9. Wait 1-2 minutes for deployment to finish
10. You will see a **"Congratulations!"** page with your URL

Your backend URL will look like:
```
https://securepass-server.vercel.app
```

📋 **COPY THIS URL** — you need it in the next steps!

---

### STEP 4: Test Your Backend

1. Open a new browser tab
2. Go to: `https://YOUR-VERCEL-URL.vercel.app/api/health`
3. You should see:
```json
{"status":"ok","timestamp":"2026-02-19T..."}
```

✅ If you see this, your backend is working!
❌ If you see an error, go back to Vercel and check the deployment logs.

---

## ═══════════════════════════════════════
## PHASE 2: DEPLOY THE FRONTEND (Netlify)
## ═══════════════════════════════════════

### STEP 5: Update the API URL in Your Code

1. Open VS Code
2. Open the file: `client/.env.production`
3. Change the URL to your **actual Vercel backend URL**:

```
VITE_API_URL=https://securepass-server.vercel.app/api/password
```

⚠️ Replace `securepass-server.vercel.app` with YOUR actual Vercel URL from Step 4!

4. **Save the file** (Ctrl+S)

---

### STEP 6: Create a GitHub Repository for Frontend

1. Open your browser
2. Go to → https://github.com/new
3. Fill in:
   - Repository name: `securepass-client`
   - Description: `SecurePass Frontend`
   - Select: Public
4. DO NOT check "Add a README file"
5. Click the green **"Create repository"** button
6. **Keep this page open**

---

### STEP 7: Push Frontend Code to GitHub

Open your **terminal/PowerShell** and run these commands **one at a time**:

```bash
cd "d:\app development\mini proj\securepass\client"
```

```bash
git add .
```

```bash
git commit -m "SecurePass frontend ready for deployment"
```

```bash
git branch -M main
```

⚠️ Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/securepass-client.git
```

```bash
git push -u origin main
```

Refresh your GitHub page — you should see your client files there.

---

### STEP 8: Deploy Frontend on Netlify

1. Open your browser
2. Go to → https://app.netlify.com
3. Click **"Sign up"** → Choose **"GitHub"** → Authorize
4. After logging in, click **"Add new site"** → **"Import an existing project"**
5. Click **"GitHub"** → Find and select **"securepass-client"**
6. On the configuration page:
   - **Base directory**: Leave **EMPTY**
   - **Build command**: Type `npm run build`
   - **Publish directory**: Type `dist`
7. Click **"Deploy securepass-client"** button
8. Wait 1-2 minutes for deployment
9. You will see your site URL like:
```
https://amazing-name-12345.netlify.app
```

📋 **COPY THIS URL!**

**Optional — Rename your site:**
- Click **"Site configuration"** → **"Change site name"**
- Type: `securepass` → your URL becomes `securepass.netlify.app`

---

## ═══════════════════════════════════════
## PHASE 3: CONNECT THEM TOGETHER
## ═══════════════════════════════════════

### STEP 9: Tell the Backend to Accept Requests from the Frontend

1. Go to → https://vercel.com
2. Click on your **"securepass-server"** project
3. Click **"Settings"** (top menu)
4. Click **"Environment Variables"** (left sidebar)
5. Add a new variable:
   - **Key**: `CLIENT_URL`
   - **Value**: `https://securepass.netlify.app` (your Netlify URL)
6. Click **"Save"**

---

### STEP 10: Redeploy the Backend

1. Still on Vercel, click **"Deployments"** (top menu)
2. Find the latest deployment
3. Click the **three dots (⋮)** on the right
4. Click **"Redeploy"** → Confirm
5. Wait for it to finish

---

## ═══════════════════════════════════════
## 🎉 YOU'RE DONE!
## ═══════════════════════════════════════

Open your Netlify URL in the browser:
```
https://securepass.netlify.app
```

Your SecurePass app is now LIVE on the internet! 🌍

---

## 🔧 TROUBLESHOOTING

### "Analysis failed" or API errors on the live site
→ Make sure VITE_API_URL in .env.production has the correct Vercel URL
→ Make sure CLIENT_URL on Vercel has the correct Netlify URL
→ Redeploy both after making changes

### Netlify shows "Page not found" on refresh
→ The netlify.toml file should handle this. Make sure it exists in the client folder.

### Vercel shows build error
→ Make sure vercel.json exists in the server folder
→ Make sure the server has no syntax errors (test locally first with npm start)

### Changes not showing up
→ Push new code to GitHub: `git add . → git commit -m "update" → git push`
→ Both Netlify and Vercel auto-redeploy when you push to GitHub!
