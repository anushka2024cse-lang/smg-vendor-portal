# Quick Start Guide

Get SMG Vendor Portal running in 5 minutes!

---

## Prerequisites Check

Before starting, ensure you have:
- ✓ Node.js 16+ installed ([Download](https://nodejs.org/))
- ✓ MongoDB running locally OR MongoDB Atlas account
- ✓ Gmail account (for email notifications)

---

## Installation (5 Steps)

### Step 1: Clone & Install
```bash
# Clone repository
git clone <repository-url>
cd SMG

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```

### Step 2: Configure Backend
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/smg-vendor-portal
JWT_SECRET=your-secret-key-here
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3000
```

### Step 3: Configure Frontend
Create `.env` in root:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Step 4: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## First Login

**Test Credentials:**
- Email: `test@example.com`
- Password: `password123`

---

## Quick Tour

### 1. Dashboard (`/dashboard`)
- Overview of vendors, POs, payments
- Quick stats

### 2. SOR Module (`/sor/list`)
- Create Statement of Requirements
- Track approvals

### 3. Notifications (`bell icon`)
- In-app notifications
- Real-time updates

### 4. Admin Panel (`/admin/notifications`)
- Send notifications
- Manage users

---

## Test Email Notifications

1. Get Gmail App Password:
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Generate 16-character password
   - Add to `EMAIL_PASS` in backend/.env

2. Send Test:
   - Navigate to `/admin/notifications`
   - Create notification
   - Check "Send Email"
   - Enter your email
   - Click Send!

---

## Common Issues

**Backend won't start:**
```bash
# Check MongoDB is running
mongod --version

# Verify .env file exists
ls backend/.env

# Check port
netstat -ano | findstr :5000
```

**Frontend won't start:**
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Check Vite config
cat vite.config.js
```

**Database connection failed:**
- For local: Start MongoDB (`mongod`)
- For Atlas: Check connection string format

---

## Next Steps

1. ✅ Read [Environment Setup](./ENVIRONMENT_SETUP.md) for details
2. ✅ Check [API Reference](./API_REFERENCE.md) for endpoints
3. ✅ Review [Codebase Structure](./CODEBASE_STRUCTURE.md)
4. ✅ Explore [Notification System](./NOTIFICATION_SYSTEM.md)

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm run dev          # Development server
npm start            # Production server

# Frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview build

# Database
mongod               # Start MongoDB
mongo                # MongoDB shell

# Git
git status           # Check status
git add .            # Stage changes
git commit -m "msg"  # Commit
git push             # Push to remote
```

---

## Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Commit & push
5. Create pull request

---

## Support

Issues? Check:
1. [Common Issues](./COMMON_ISSUES.md)
2. [Troubleshooting](./ENVIRONMENT_SETUP.md#troubleshooting)
3. Project documentation

---

**That's it! You're ready to develop! 🚀**
