# Environment Setup Guide

## Prerequisites

- Node.js 16+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed
- Code editor (VS Code recommended)

---

## Backend Environment Variables

Create `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/smg-vendor-portal
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smg-vendor-portal

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Email Configuration (Gmail)
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM_NAME=SMG Vendor Portal
EMAIL_FROM_ADDRESS=noreply@smg-portal.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Optional: SendGrid (alternative to Gmail)
# SENDGRID_API_KEY=your-sendgrid-api-key

# Optional: AWS S3 (for file uploads - future)
# AWS_ACCESS_KEY_ID=your-aws-access-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret-key
# AWS_S3_BUCKET=smg-vendor-portal-uploads
# AWS_REGION=us-east-1

# Optional: Redis (for caching - future)
# REDIS_HOST=localhost
# REDIS_PORT=6379
```

---

## Frontend Environment Variables

Create `.env` file in root:

```env
# API Base URL
VITE_API_URL=http://localhost:5000/api/v1

# App Configuration
VITE_APP_NAME=SMG Vendor Portal
VITE_APP_VERSION=1.0.0
```

---

## Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select app: "Mail"
3. Select device: "Other (Custom name)" - enter "SMG Portal"
4. Click "Generate"
5. Copy the 16-character password
6. Paste in `EMAIL_PASS` in `.env`

**Important:** Use the app password, NOT your regular Gmail password!

---

## MongoDB Setup

### Option 1: Local MongoDB

**Install:**
```bash
# Windows (using Chocolatey)
choco install mongodb

# Mac (using Homebrew)
brew install mongodb-community

# Start MongoDB
mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist your IP (or allow from anywhere: 0.0.0.0/0)
5. Get connection string
6. Replace in `MONGODB_URI`

---

## Installation Steps

### 1. Clone Repository
```bash
git clone <repository-url>
cd SMG
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 3. Setup Environment Files
```bash
# Create backend .env
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Create frontend .env
cp .env.example .env
# Edit .env with your values
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1

---

## Verification

### Test Backend
```bash
curl http://localhost:5000/api/v1/notifications
```

Should return JSON response.

### Test Email
1. Go to http://localhost:3000/admin/notifications
2. Create a test notification
3. Check "Send Email"
4. Enter your email
5. Click "Send"
6. Check your inbox!

---

## Production Environment

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<production-mongodb-url>
JWT_SECRET=<strong-random-secret>
EMAIL_SERVICE=SendGrid
SENDGRID_API_KEY=<your-sendgrid-key>
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment-specific MongoDB URI
- [ ] Enable CORS only for your domain
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Remove console.logs
- [ ] Add monitoring (Sentry, etc.)

---

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and is properly formatted
- Check port 5000 is not in use

### Frontend won't start
- Check `.env` file exists
- Verify `VITE_API_URL` is correct
- Check port 3000 is not in use

### Email not sending
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASS in `.env`
- Ensure 2FA is enabled on Gmail
- Check backend logs for errors

### Database connection errors
- Verify MongoDB is running
- Check `MONGODB_URI` format
- For Atlas: Verify IP whitelist
- Check database user has proper permissions

---

## Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- Thunder Client (API testing)
- GitLens

### Useful Commands

**Backend:**
```bash
npm run dev          # Start dev server
npm run start        # Start production server
npm test             # Run tests
```

**Frontend:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Next Steps

After setup:
1. Read [API Reference](./API_REFERENCE.md)
2. Check [Codebase Structure](./CODEBASE_STRUCTURE.md)
3. Review [Development Workflow](./DEVELOPMENT_WORKFLOW.md)
