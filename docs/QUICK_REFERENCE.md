# SMG Vendor Portal - Quick Reference Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB running on localhost:27017
- Git

### Installation
```bash
# Clone repository
git clone <repo-url>
cd SMG

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Running the Application

**Option 1: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

**Option 2: Concurrent Start**
```bash
# From root directory
npm run dev:all
```

### Access Points
- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017/smg_db`

---

## 📋 Common Tasks

### Create a Vendor
1. Navigate to `/vendor/onboarding`
2. Fill 4-step form (Identity, Address, Finance, Compliance)
3. Click "Submit Application"
4. Vendor appears in `/vendor/list`

### Create a Payment
1. Navigate to `/payments`
2. Click "Create Payment" button
3. Select vendor from dropdown
4. Fill invoice and amount details
5. TDS auto-calculates (2%)
6. Click "Create Payment"

### View Orders
1. Navigate to `/orders`
2. Filter by status or search
3. Click row for details

---

## 🐛 Troubleshooting

### White Screen on Login
**Cause**: Socket.IO connection issue  
**Fix**: Check backend is running on port 5000

### Vendors Not Showing in Dropdown
**Cause**: Vendor API fetch error  
**Fix**: 
1. Check backend `/api/v1/vendors` endpoint
2. Verify vendors exist in database

### Payment Creation Fails
**Cause**: Validation error  
**Fix**:
1. Fill all required fields
2. Ensure vendor is selected
3. Check backend logs for details

### Form Data Disappears
**Cause**: Component re-render without state  
**Fix**: Already fixed - data now persists

---

## 📁 Project Structure

```
SMG/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   └── server.js        # Entry point
├── src/
│   ├── pages/           # React pages
│   ├── components/      # Reusable components
│   ├── services/        # API clients
│   └── App.jsx          # Routes
├── docs/                # Documentation
└── package.json
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - New user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Current user

### Vendors
- `GET /api/v1/vendors` - List all
- `POST /api/v1/vendors` - Create
- `GET /api/v1/vendors/:id` - Get one
- `PUT /api/v1/vendors/:id` - Update
- `DELETE /api/v1/vendors/:id` - Delete

### Payments
- `GET /api/v1/payments` - List all
- `POST /api/v1/payments` - Create
- `PUT /api/v1/payments/:id/approve` - Approve
- `PUT /api/v1/payments/:id/process` - Process
- `PUT /api/v1/payments/:id/complete` - Complete
- `POST /api/v1/payments/:id/send-request` - Send request

### Orders
- `GET /api/v1/orders` - List all
- `POST /api/v1/orders` - Create
- `PUT /api/v1/orders/:id/status` - Update status
- `GET /api/v1/orders/stats` - Statistics

---

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/smg_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📊 Database Collections

| Collection | Purpose | Auto-generated |
|------------|---------|----------------|
| users | User accounts | _id |
| vendors | Vendor profiles | vendorId (V-XXXX) |
| payments | Payment records | paymentNumber (PAY-2025-XXX) |
| orders | Purchase orders | orderNumber (ORD-XXX) |
| notifications | System notifications | _id |

---

## 🎨 UI Theme

**Colors**:
- Primary: `#1e3a8a` (blue-900)
- Secondary: `#64748b` (slate-600)
- Success: `#10b981` (green-500)
- Warning: `#f59e0b` (amber-500)
- Error: `#ef4444` (red-500)

**Font**:
- Family: Inter, system-ui
- Sizes: 12px (small), 14px (base), 16px (large), 24px (heading)

---

## 🧪 Testing

### Manual Testing
```bash
# Run development server
npm run dev

# Test user login
Email: admin@example.com
Password: admin123
```

### API Testing (Postman/Thunder Client)
```bash
# Login first to get token
POST http://localhost:5000/api/v1/auth/login
Body: { "email": "admin@example.com", "password": "admin123" }

# Use token in subsequent requests
Authorization: Bearer <token>
```

---

## 📚 Documentation Links

- [Vendor Onboarding Fixes](./VENDOR_ONBOARDING_FIXES.md)
- [Payment System Fixes](./PAYMENT_SYSTEM_FIXES.md)
- [Vendor List Integration](./VENDOR_LIST_INTEGRATION.md)
- [API Documentation](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 💡 Tips & Best Practices

### Development
- Always run backend before frontend
- Check browser console for errors
- Use React DevTools for debugging
- Monitor backend logs in terminal

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/vendor-improvements

# Commit changes
git add .
git commit -m "fix: vendor onboarding state persistence"

# Push to remote
git push origin feature/vendor-improvements
```

### Code Style
- Use functional React components
- Use async/await for API calls
- Add try-catch for error handling
- Use Tailwind CSS classes
- Comment complex logic

---

## 🆘 Support

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request payload |
| 401 | Unauthorized | Login again |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | Check backend logs |

### Getting Help
1. Check this documentation
2. Search error in browser console
3. Review backend logs
4. Check Git commit history
5. Ask team members

---

**Last Updated**: December 23, 2025  
**Version**: 1.2.0  
**Status**: Production Ready
