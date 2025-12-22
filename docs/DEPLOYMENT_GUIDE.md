# Deployment Guide - Testing Environment

Complete guide to deploy SMG Vendor Portal for testing using **Netlify** (Frontend) and **Render** (Backend).

> **Note:** This is a temporary setup for development/testing. Production deployment will use AWS infrastructure.

---

## 🎯 Deployment Stack

| Component | Platform | Free Tier | Cold Start |
|-----------|----------|-----------|------------|
| **Frontend** | Netlify | ✅ 100GB bandwidth/month | ❌ No |
| **Backend** | Render | ✅ 750 hours/month | ⚠️ Yes (15min idle) |
| **Database** | MongoDB Atlas | ✅ 512MB storage | ❌ No |

---

## 🚀 Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

Create `d:\SMG\backend\package.json` and ensure it has:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for auto-deploy)
3. Verify your email

### Step 3: Deploy Backend

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `smg-vendor-portal` repo

2. **Configure Service**
   ```
   Name: smg-backend
   Region: Singapore (closest to you) or Frankfurt
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**
   Click "Environment" → "Add Environment Variable"
   
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=https://your-app.netlify.app
   
   # Email (if using)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for first deploy
   - Note your backend URL: `https://smg-backend.onrender.com`

---

## 🌐 Part 2: Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

Create `d:\SMG\netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

Update `d:\SMG\.env.production`:

```env
VITE_API_BASE_URL=https://smg-backend.onrender.com/api/v1
```

### Step 2: Deploy to Netlify

**Option A: Drag & Drop (Quick Test)**
1. Build locally: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag `dist` folder
4. Get instant URL: `https://random-name.netlify.app`

**Option B: GitHub Integration (Recommended)**

1. Go to [app.netlify.com](https://app.netlify.com)
2. "Add new site" → "Import from Git"
3. Choose GitHub → Select `smg-vendor-portal`
4. Configure:
   ```
   Branch: main
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: dist
   ```

5. **Environment Variables**
   - Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://smg-backend.onrender.com/api/v1`

6. **Deploy**
   - Triggers automatically on push to main
   - Get URL: `https://smg-vendor-portal.netlify.app`

### Step 3: Custom Domain (Optional)

1. Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records as shown

---

## 💾 Part 3: MongoDB Atlas Setup

### Create Free Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create Cluster (M0 Free tier)
4. Choose **AWS Singapore** (closest region)

### Configure Access

1. **Database Access** → Add User
   ```
   Username: smg-admin
   Password: (generate strong password)
   Role: Read and write to any database
   ```

2. **Network Access** → Add IP Address
   ```
   Add: 0.0.0.0/0 (Allow from anywhere)
   Comment: Render backend
   ```

3. **Get Connection String**
   - Connect → Drivers → Node.js
   - Copy connection string
   - Replace `<password>` with your password
   - Add to Render environment variables

---

## 🔄 Deployment Workflow

### Automatic Deployment

Both Netlify and Render auto-deploy on git push:

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

- **Netlify**: Deploys in 1-2 minutes
- **Render**: Deploys in 3-5 minutes

### Manual Deployment

**Render:**
- Dashboard → Manual Deploy → Deploy latest commit

**Netlify:**
- Deploys → Trigger deploy

---

## ⚠️ Render Free Tier Limitations

**Issue:** Backend sleeps after 15 minutes of inactivity

**Solutions:**

1. **Accept Cold Starts** (30-60 seconds first request)
   - Simple, no cost
   - Users wait on first page load

2. **Use Cron Job to Keep Alive**
   - Add [UptimeRobot](https://uptimerobot.com/) (free)
   - Ping your backend every 14 minutes
   - Prevents sleep

3. **Upgrade to Render Paid** ($7/month)
   - No sleep
   - Better for production testing

---

## 🆓 Better Free Alternatives

### For Backend (Instead of Render)

#### 1. **Railway** ⭐ Recommended
- **Free:** $5 credit/month (≈ 500 hours)
- **No sleep** on free tier
- **Fast** cold starts
- **Easy** setup

**Setup:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up
```

#### 2. **Fly.io**
- **Free:** 3 shared VMs
- **No sleep**
- **Global CDN**
- **More complex** setup

#### 3. **Cyclic.sh**
- **Free:** Unlimited
- **No sleep**
- **Node.js optimized**
- **Simple** GitHub integration

### Comparison Table

| Platform | Free Tier | Sleep | Speed | Ease |
|----------|-----------|-------|-------|------|
| **Render** | 750hrs | ⚠️ Yes (15min) | Fast | ⭐⭐⭐⭐⭐ |
| **Railway** | $5 credit | ❌ No | Fast | ⭐⭐⭐⭐ |
| **Fly.io** | 3 VMs | ❌ No | Fast | ⭐⭐⭐ |
| **Cyclic** | Unlimited | ❌ No | Medium | ⭐⭐⭐⭐⭐ |

**Recommendation for Testing:**
- **If okay with cold starts:** Render (easiest)
- **If need always-on:** Railway or Cyclic

---

## 🧪 Testing Deployment

### Health Check

```bash
# Backend
curl https://smg-backend.onrender.com/

# Should return: {"message":"SMG Vendor Portal API is running successfully!"}
```

### Login Test

```bash
# Test login
curl -X POST https://smg-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@smg.com",
    "password": "password123"
  }'
```

### Frontend

Visit `https://your-app.netlify.app` and:
1. ✅ Page loads
2. ✅ Login works
3. ✅ API calls succeed
4. ✅ WebSocket connects

---

## 🐛 Common Issues

### 1. CORS Errors

**Fix:** Update `backend/server.js`:
```javascript
app.use(cors({
    origin: 'https://your-app.netlify.app',
    credentials: true
}));
```

### 2. Environment Variables Not Working

**Fix:**
- Rebuild after adding env vars
- Check spelling (case-sensitive!)
- Restart service

### 3. Database Connection Failed

**Fix:**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure password has no special chars or encode them

### 4. Build Fails on Netlify

**Fix:**
- Check `package.json` has `build` script
- Ensure all dependencies in `package.json`
- Check Node version compatibility

### 5. Backend 500 Errors

**Check Logs:**
- Render: Dashboard → Logs
- Look for error stack traces
- Check environment variables loaded

---

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor CPU/Memory usage
- Check deploy history

### Netlify Dashboard
- Deploy logs
- Function logs (if using)
- Bandwidth usage

### MongoDB Atlas
- Database connections
- Query performance
- Storage usage

---

## 🔐 Security Checklist

Before testing:

- [ ] Changed `JWT_SECRET` from default
- [ ] Using Gmail App Password (not account password)
- [ ] MongoDB has strong password
- [ ] CORS configured for production URL
- [ ] Environment variables set in hosting platform
- [ ] `.env` files NOT committed to git
- [ ] Rate limiting enabled (add for production)

---

## 📈 Next Steps (Before AWS Migration)

1. **Test thoroughly** on Render + Netlify
2. **Monitor usage** and performance
3. **Gather metrics** (response times, errors)
4. **Document issues** for AWS migration
5. **Plan AWS architecture** based on testing

---

## 🎓 Quick Deploy Commands

```bash
# Full deployment workflow
git add .
git commit -m "deploy: update for testing"
git push origin main

# Both platforms will auto-deploy
# Netlify: ~2 minutes
# Render: ~4 minutes
```

---

## 💡 Cost Comparison

| Setup | Monthly Cost | Cold Starts |
|-------|--------------|-------------|
| **Free Tier** | $0 | Yes |
| **Railway** | $5-10 | No |
| **Render Paid** | $7 | No |
| **Fly.io Paid** | $5-8 | No |

**For Testing:** Start with free tier, upgrade if cold starts become annoying.

---

## 📞 Support

**Render Issues:**
- [Render Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)

**Netlify Issues:**
- [Netlify Docs](https://docs.netlify.com)
- [Support Forum](https://answers.netlify.com)

---

**Ready to deploy? Follow Part 1 → Part 2 → Part 3 in order!** 🚀
