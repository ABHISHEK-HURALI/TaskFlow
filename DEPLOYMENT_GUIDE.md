# 🚀 Complete Deployment Guide - TaskFlow

This guide will help you deploy TaskFlow to production in 30 minutes!

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Choose Your Deployment Platform](#choose-your-deployment-platform)
3. [Deploy to Railway (EASIEST) ⭐](#deploy-to-railway)
4. [Deploy to Heroku](#deploy-to-heroku)
5. [Deploy to Vercel (Frontend)](#deploy-to-vercel-frontend)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

✅ GitHub account  
✅ GitHub repository with code pushed  
✅ Production domain (optional - get free .tk domain)  
✅ Credit card (for free tier with usage limits)  

---

## Choose Your Deployment Platform

| Platform | Backend | Frontend | Cost | Ease | WebSocket |
|----------|---------|----------|------|------|-----------|
| **Railway** | ✅ | ✅ | $5/mo | ⭐⭐⭐ | ✅ |
| **Heroku + Vercel** | ✅ | ✅ | $7/mo | ⭐⭐ | ✅ |
| **AWS** | ✅ | ✅ | $15+/mo | ⭐ | ✅ |
| **DigitalOcean** | ✅ | ✅ | $5+/mo | ⭐⭐ | ✅ |

**Recommendation:** Railway + Vercel (easiest, cheapest)

---

# 🚂 Deploy to Railway (EASIEST)

## Step 1: Prepare Your Code

```bash
cd task-management-application

# Make sure everything is committed
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Sign up"
3. Sign up with GitHub
4. Authorize Railway to access your repos

## Step 3: Create Backend Project

1. Click "New Project" → "Deploy from GitHub repo"
2. Select `task-management-application` repo
3. Select "Python" as plugin
4. Add "MySQL" database plugin
5. Configure environment variables

### Environment Variables for Railway:

Go to **Variables** tab and add:

```env
DEBUG=False
SECRET_KEY=your-new-secret-key-here
ENVIRONMENT=production

# Database (Railway will provide DATABASE_URL)
# Don't add DB_* if using DATABASE_URL

# CORS & Security
ALLOWED_HOSTS=*.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app

# WebSocket (Railway provides Redis automatically)
REDIS_URL=your-redis-connection-string
```

## Step 4: Configure Build & Start Commands

1. Go to **Deployments** → **Settings**
2. Set Build Command:
   ```bash
   cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
   ```
3. Set Start Command:
   ```bash
   cd backend && daphne -b 0.0.0.0 -p $PORT config.asgi:application
   ```

## Step 5: Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. **Important:** Set Root Directory = `frontend`
5. Add Environment Variables:
   ```env
   VITE_API_URL=https://your-backend-url/api
   ```
6. Click Deploy

## Step 6: Get Your URLs

**Backend URL:** (from Railway dashboard)
- Example: `https://taskflow-backend.railway.app`

**Frontend URL:** (from Vercel)
- Example: `https://taskflow.vercel.app`

## Step 7: Update CORS

Go back to Railway → Backend → Variables

Update:
```env
CORS_ALLOWED_ORIGINS=https://taskflow.vercel.app
CSRF_TRUSTED_ORIGINS=https://taskflow.vercel.app
```

## Step 8: Run Migrations

Railway runs migrations automatically, but verify:

```bash
# Check Railway logs
# Settings → View Logs
# Look for "Applying tasks.0001_initial... OK"
```

If migrations didn't run:
```bash
# SSH into Railway
railway login
railway connect
python backend/manage.py migrate
```

## Step 9: Test Everything

1. Open `https://taskflow.vercel.app`
2. Register a new account
3. Create a task
4. Check it appears on dashboard
5. Open in 2 tabs - verify real-time updates

✅ **You're live!**

---

# 🔴 Deploy to Heroku

## Step 1: Install Heroku CLI

```bash
# Download from heroku.com/cli
heroku login
```

## Step 2: Create Heroku App

```bash
cd task-management-application/backend

# Create app
heroku create your-app-name

# Add MySQL database
heroku addons:create cleardb:ignite

# Add Redis for WebSocket
heroku addons:create heroku-redis:premium-0
```

## Step 3: Set Environment Variables

```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-new-secret-key
heroku config:set ALLOWED_HOSTS=your-app-name.herokuapp.com
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
heroku config:set CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app

# Verify
heroku config
```

## Step 4: Deploy

```bash
# Make sure Procfile and runtime.txt exist
ls Procfile runtime.txt

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser (optional)
heroku run python manage.py createsuperuser
```

## Step 5: View Logs

```bash
heroku logs --tail
```

## Step 6: Get Your Backend URL

```bash
heroku apps:info
# URL: https://your-app-name.herokuapp.com
```

Then follow **Vercel deployment** for frontend (see next section).

---

# 🔵 Deploy to Vercel (Frontend)

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

## Step 2: Import Project

1. Click "Add New" → "Project"
2. Select your GitHub repo
3. Set **Root Directory:** `frontend`

## Step 3: Configure Environment Variables

Click **Environment Variables** and add:

```env
VITE_API_URL=https://your-backend-url.herokuapp.com/api
# or
VITE_API_URL=https://your-backend-url.railway.app/api
```

## Step 4: Configure Build Settings

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Step 5: Deploy

Click "Deploy" button

Vercel will automatically deploy every time you push to GitHub!

---

## 🎯 Post-Deployment Checklist

### ✅ Backend Checks

```bash
# Check health
curl https://your-backend.railway.app/api/

# Test API
curl https://your-backend.railway.app/api/tasks/

# Check admin panel
curl https://your-backend.railway.app/admin/
```

### ✅ Frontend Checks

1. Open website
2. Register new account
3. Create task
4. Edit task
5. Delete task
6. Test search/filters
7. Test on mobile (DevTools)
8. Test real-time (2 tabs)

### ✅ Performance Checks

```bash
# Backend response time
time curl https://your-backend.railway.app/api/

# Check logs for errors
# Railway: View Logs
# Heroku: heroku logs --tail
# Vercel: Deployments → Logs
```

### ✅ Security Checks

- [ ] DEBUG=False
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] No secrets in code
- [ ] `.env` in `.gitignore`
- [ ] CSRF protection enabled

### ✅ Real-Time Updates Test

1. Open app in 2 browser tabs
2. Create task in Tab 1
3. Verify appears in Tab 2 instantly
4. Check browser console for WebSocket messages

---

## 🆘 Troubleshooting

### WebSocket Won't Connect

```
Error: WebSocket connection failed
```

**Solution:**
1. Check CORS settings on backend
2. Verify frontend URL in CORS_ALLOWED_ORIGINS
3. Check backend logs for WebSocket errors
4. Ensure Redis is running (Railway/Heroku addon)

### Database Connection Failed

```
Error: (2003, "Can't connect to MySQL server")
```

**Solution:**
1. Verify DATABASE_URL in backend environment
2. Check database addon is active
3. Run migrations: `heroku run python manage.py migrate`
4. Restart app: `heroku restart`

### Static Files Not Loading

```
404 Not Found: /static/admin/css/...
```

**Solution:**
```bash
# Backend
heroku run python manage.py collectstatic --noinput
heroku restart
```

### Frontend Can't Connect to Backend

```
Error: CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution:**
1. Update VITE_API_URL in Vercel environment
2. Update CORS_ALLOWED_ORIGINS in backend
3. Redeploy both
4. Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Monitor Your Deployment

### Railway Dashboard
- CPU/Memory usage
- Request logs
- Error tracking
- Deployment history

### Vercel Dashboard
- Deployment status
- Build logs
- Performance metrics
- Analytics

### Heroku Dashboard
- Dyno type
- Resource usage
- Error logs
- Metric tracking

---

## 💰 Cost Estimate

| Service | Free Tier | Paid Tier | Cost/Month |
|---------|-----------|-----------|-----------|
| Railway | Yes ($5 credit) | Pay-as-you-go | $5-20 |
| Heroku | No (ended) | Paid only | $7+ |
| Vercel | Yes | Pro | $0-20 |
| Redis | Limited | $1.50+ | $1.50+ |
| MySQL | Limited | $5+ | $5+ |
| **Total** | - | - | **$10-40** |

**Budget Option:** Railway ($10-15/month for everything)

---

## 🚀 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel → Deployments
2. Click "Settings"
3. Add domain under "Domains"
4. Follow Vercel's DNS instructions

### Add Custom Domain to Railway/Heroku

1. Purchase domain (Namecheap, GoDaddy, etc.)
2. Add CNAME record pointing to Railway/Heroku
3. Wait for DNS propagation (15 min - 24 hours)

---

## 📚 Next Steps After Deployment

1. ✅ Verify everything works
2. ✅ Set up monitoring (Sentry, Datadog)
3. ✅ Enable SSL/HTTPS (auto-enabled)
4. ✅ Set up backups
5. ✅ Configure error logging
6. ✅ Add Google Analytics
7. ✅ Test on mobile devices
8. ✅ Share with team

---

## 🎉 You're Live!

**Congratulations! Your app is now deployed to production!**

- Frontend: `https://your-domain.vercel.app`
- Backend: `https://your-api.railway.app`
- WebSocket: `wss://your-api.railway.app/ws/tasks/`

Share it with friends and celebrate! 🎊

---

## 📞 Support

**Railway:** https://docs.railway.app  
**Vercel:** https://vercel.com/docs  
**Heroku:** https://devcenter.heroku.com  

Need help? Check their documentation or community forums!

---

**Deployment completed successfully!** ✅
