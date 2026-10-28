# Deployment Guide - Planspiel Website

Complete guide to deploy your website for **free** on various platforms.

## 🎯 Quick Comparison

| Platform | Backend | Frontend | Cost | Setup Time |
|----------|---------|----------|------|-----------|
| **Railway** | ✅ Free Tier | ✅ Included | Free | 5 min |
| **Netlify + Railway** | Railway | Netlify | Free | 10 min |
| **Vercel + Railway** | Railway | Vercel | Free | 10 min |
| **Replit** | ✅ Included | ✅ Included | Free | 3 min |
| **Docker Hub** | Own Infrastructure | Own Infrastructure | Free (image only) | 10 min |

## ✅ Option 1: Railway (All-in-One) - **RECOMMENDED**

Railway offers **$5/month free credits**, which is enough for this project.

### Step 1: Prepare Your Code
```bash
cd /path/to/planspiel-website
git init
git add .
git commit -m "Initial commit: Planspiel website"
```

### Step 2: Push to GitHub
```bash
# Create new repo on github.com
git remote add origin https://github.com/YOUR_USERNAME/planspiel-website.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Docker Compose configuration
5. Click "Deploy"
6. Get your public URL from the dashboard

### Step 4: Update Frontend API URL

Once deployed, Railway gives you a URL like `https://planspiel-website-production.up.railway.app`

Update `frontend/script.js`:
```javascript
const API_BASE_URL = 'https://planspiel-website-production.up.railway.app/api';
```

Push this change:
```bash
git add frontend/script.js
git commit -m "Update API URL for production"
git push
```

Railway auto-redeploys! ✅

---

## ✅ Option 2: Netlify (Frontend) + Railway (Backend)

**Best for separation of concerns**

### Backend on Railway
Follow **Option 1** steps 1-4 above

### Frontend on Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Deploy manually"
3. Drag & drop the `frontend` folder
4. Wait for deployment
5. In Netlify, go to Site Settings → Build & Deploy
6. Redeploy with updated API URL:

```bash
# Option A: Set as environment variable in Netlify
# In Netlify UI: Site Settings → Build & deploy → Environment
API_BASE_URL=https://your-railway-backend.up.railway.app/api
```

Or update the file:
```bash
# Option B: Update script.js before uploading
# frontend/script.js line ~1
const API_BASE_URL = 'https://your-railway-backend.up.railway.app/api';
```

---

## ✅ Option 3: Vercel (Frontend) + Railway (Backend)

### Backend on Railway
Follow **Option 1** steps 1-4

### Frontend on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. In settings, update environment variables:
   ```
   API_BASE_URL=https://your-railway-backend.up.railway.app/api
   ```
5. Click Deploy

---

## ✅ Option 4: Replit (Everything)

**Easiest** - just upload and run

1. Go to https://replit.com
2. Click "Create" → "Import from GitHub"
3. Paste: `https://github.com/YOUR_USERNAME/planspiel-website.git`
4. Click "Import"
5. Click "Run"
6. Replit gives you a public URL! ✅

The `docker-compose.yml` and `Dockerfile` are automatically detected.

---

## ✅ Option 5: DigitalOcean (Full Control)

Free $200 credit (60 days) - perfect for trying out!

### Setup

1. Get free credits: https://www.digitalocean.com/
2. Create new App from container registry
3. Authenticate Docker:
   ```bash
   docker login -u $YOUR_DO_TOKEN -p $YOUR_DO_TOKEN registry.digitalocean.com
   ```

4. Tag and push image:
   ```bash
   docker tag planspiel-website:latest registry.digitalocean.com/YOUR_REGISTRY/planspiel-website:latest
   docker push registry.digitalocean.com/YOUR_REGISTRY/planspiel-website:latest
   ```

5. Deploy in DigitalOcean dashboard

---

## ✅ Option 6: Google Cloud Run

**Pay per use** (very cheap/free for low traffic)

1. Create Google Cloud account (free tier available)
2. Push to Container Registry:
   ```bash
   gcloud auth configure-docker
   docker tag planspiel-website:latest gcr.io/YOUR_PROJECT/planspiel-website:latest
   docker push gcr.io/YOUR_PROJECT/planspiel-website:latest
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy planspiel-website \
     --image gcr.io/YOUR_PROJECT/planspiel-website:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

---

## ✅ Option 7: AWS (EC2 Free Tier)

**1 year free** with AWS free tier account

1. Create EC2 instance (t2.micro - free)
2. SSH into instance
3. Install Docker:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

4. Clone your repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/planspiel-website.git
   cd planspiel-website
   ```

5. Run:
   ```bash
   sudo docker-compose up -d
   ```

6. Get EC2 public IP and update API URL

---

## ✅ Option 8: Microsoft Azure

**Free tier** - $200 credit + free services for 12 months

1. Create Azure account
2. Create Container Instance with your Docker image
3. Deploy and get public IP

---

## 🔄 Continuous Deployment

### With Railway
- Just `git push` to main → auto-deploys ✅

### With Netlify/Vercel
- Connect GitHub → auto-deploys on push ✅

### With DigitalOcean/GCP/AWS
- Setup GitHub Actions:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        run: |
          docker build -t planspiel-website .
          # Push to your registry and redeploy
```

---

## 🌐 Domain Setup

### Custom Domain (Optional)

1. Buy domain from:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Cloudflare

2. Point to your deployment:
   - **Railway**: Add custom domain in Railway dashboard
   - **Netlify**: Settings → Domain → Add custom domain
   - **Vercel**: Settings → Domains → Add domain
   - **Others**: Update DNS A records

---

## 🔐 Environment Variables in Production

Never commit `.env` files!

### Railway
Settings → Variables → Add:
```
API_BASE_URL=https://your-app.up.railway.app/api
PYTHONUNBUFFERED=1
```

### Netlify/Vercel
Site Settings → Environment Variables

### Others
Create `.env` in production manually

---

## 🧪 Testing Deployed Site

```bash
# Test API
curl https://your-deployed-backend.up.railway.app/api/config

# Test frontend
open https://your-deployed-frontend.com
```

---

## 💾 Backups & Monitoring

### For Database (when you add one)
- Railway: Automatic backups included
- DigitalOcean: Managed databases with auto-backup
- AWS RDS: Free tier available with auto-backup

### Monitoring
- Railway: Built-in monitoring
- Others: Use free services like:
  - Uptime Robot (free alerts)
  - New Relic (free tier)
  - DataDog (free tier)

---

## 🆘 Troubleshooting Deployments

### Frontend can't reach backend
- ✅ Check backend URL in `frontend/script.js`
- ✅ Check CORS is enabled in `backend/main.py`
- ✅ Check backend is running: `curl https://your-backend/health`

### Docker build fails
```bash
# Build locally first
docker-compose build --no-cache
docker-compose up
# If works locally, issue is platform-specific
```

### Port conflicts
- Change ports in `docker-compose.yml`
- Or use Railway/Netlify (handle ports automatically)

### Out of memory
- Upgrade instance type
- Most platforms auto-scale

---

## 📚 Useful Links

- [Railway Docs](https://docs.railway.app/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Replit Docs](https://docs.replit.com/)
- [Docker Docs](https://docs.docker.com/)

---

**Recommended**: Start with **Railway** or **Replit** - they're the fastest to get your site live!
