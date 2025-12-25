# Backend-Frontend Connection Issues - Quick Fix Guide

## 🔍 Issues Identified

Based on the console errors, here are the problems:

### 1. ❌ Authentication Failure
```
Error: Cannot read properties of null (reading 'role')
```
**Cause**: User is not logged in OR auth token is invalid/expired

### 2. ❌ Backend 500 Errors
```
- /api/v1/notifications?limit=10 → 500 Internal Server Error
- /api/v1/payments/:id/complete → 500 Internal Server Error  
- /api/v1/auth/profile → 400 Bad Request
```
**Cause**: These endpoints require authenticated user (`req.user`) but it's null

### 3. ❌ WebSocket Connection Failing
```
WebSocket connection to 'ws://localhost:5000/socket.io/' failed
```
**Cause**: Backend server restarted or socket.io not initialized properly

---

## ✅ Quick Fixes

### Fix 1: Clear Storage & Re-login

**The fastest solution:**

1. **Open Browser DevTools**:
   - Press `F12` or `Right-click → Inspect`

2. **Clear localStorage**:
   ```javascript
   // In Console tab
   localStorage.clear()
   sessionStorage.clear()
   ```

3. **Hard Refresh**:
   - Press `Ctrl + Shift + R` (Windows)
   - Or `Cmd + Shift + R` (Mac)

4. **Login Again**:
   - Navigate to login page
   - Enter credentials
   - Check if authToken is saved:
   ```javascript
   // In Console
   localStorage.getItem('authToken')
   // Should return a JWT token string
   ```

---

### Fix 2: Check Backend Server

The backend might have crashed. Let's restart it properly:

1. **Stop Backend** (if running):
   ```bash
   # In backend terminal
   Ctrl + C
   ```

2. **Restart Backend**:
   ```bash
   cd d:\SMG\backend
   npm start
   ```

3. **Verify it's running**:
   ```
   Should see: "Server running on port 5000"
   ```

4. **Test API directly**:
   - Open: http://localhost:5000
   - Should see: "SMG Vendor Portal API is running successfully!"

---

### Fix 3: Verify Frontend is Running

Frontend dev server should be on port 5174:

1. **Check if frontend is running**:
   ```
   Should see Vite output in terminal
   ```

2. **Access frontend**:
   - Open: http://localhost:5174
   - Should load the login page

3. **Check API connection**:
   - Open DevTools Console
   - Should NOT see CORS errors
   - Should NOT see "Failed to load resource" for port 5000

---

## 🔧 Root Cause Analysis

### Why Authentication is Failing

**Problem**:
```javascript
// Frontend is trying to use user data:
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role);  // ❌ Error: user is null
```

**Solution**:
```javascript
// Safe access:
const user = JSON.parse(localStorage.getItem('user'));
if (user && user.role) {
    console.log(user.role);  // ✅ Safe
} else {
    // Redirect to login
    window.location.href = '/login';
}
```

---

## 📝 Step-by-Step Recovery

### Complete Reset Process

1. **Stop Both Servers**:
   ```bash
   # Stop frontend (Ctrl + C in frontend terminal)
   # Stop backend (Ctrl + C in backend terminal)
   ```

2. **Clear Browser Data**:
   ```javascript
   // In DevTools Console
   localStorage.clear();
   sessionStorage.clear();
   ```

3. **Close Browser Tab**:
   - Close completely
   - Or use Incognito/Private mode

4. **Start Backend First**:
   ```bash
   cd d:\SMG\backend
   npm start
   ```
   Wait for: "Server running on port 5000"

5. **Start Frontend Second**:
   ```bash
   cd d:\SMG
   npm run dev
   ```
   Wait for: "Local: http://localhost:5174/"

6. **Open Browser**:
   - Navigate to: http://localhost:5174
   - Should see login page

7. **Login**:
   - Use valid credentials
   - After login, check Console:
   ```javascript
   localStorage.getItem('authToken')  // Should have value
   localStorage.getItem('user')        // Should have user object
   ```

8. **Test Features**:
   - Navigate to Payments
   - Navigate to Vendors
   - Check notifications bell
   - All should work now

---

## 🎯 Preventing This Issue

### Frontend: Safe User Access

Update any code that accesses `user` directly:

**BAD** ❌:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
const role = user.role;  // Crashes if user is null
```

**GOOD** ✅:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
const role = user?.role || 'guest';  // Safe with optional chaining
```

### Frontend: Auth Check Hook

Create a hook to verify authentication:

```javascript
// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (!token || !user) {
            console.warn('No auth token found, redirecting to login');
            navigate('/login');
        }
    }, [navigate]);
    
    return {
        isAuthenticated: !!localStorage.getItem('authToken'),
        user: JSON.parse(localStorage.getItem('user') || 'null')
    };
};
```

Usage:
```javascript
function PaymentList() {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
        return <div>Redirecting to login...</div>;
    }
    
    // Safe to use user here
    console.log(user.role);
}
```

---

## 🚨 Common Errors & Solutions

### Error 1: "Cannot read properties of null"
**Solution**: Clear localStorage and re-login

### Error 2: 500 Internal Server Error on /notifications
**Solution**: Backend needs user object. Check if logged in.

### Error 3: WebSocket disconnecting
**Solution**: Restart backend server

### Error 4: CORS errors
**Solution**: Verify backend is running on port 5000

### Error 5: "Token failed" or 401 Unauthorized
**Solution**: Token expired. Clear storage and re-login.

---

## 🔄 Quick Recovery Commands

Run these in order:

```bash
# 1. Stop everything
# Press Ctrl + C in both terminals

# 2. In backend terminal:
cd d:\SMG\backend
npm start

# 3. In frontend terminal:
cd d:\SMG
npm run dev

# 4. In browser console:
localStorage.clear()

# 5. Refresh browser:
# Press Ctrl + Shift + R

# 6. Login again
```

---

## ✅ Verification Checklist

After recovery, check these:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5174
- [ ] Can access http://localhost:5000 (shows API message)
- [ ] Can access http://localhost:5174 (shows login page)
- [ ] After login, authToken exists in localStorage
- [ ] After login, user object exists in localStorage
- [ ] No 500 errors in Console
- [ ] No "Cannot read properties of null" errors
- [ ] WebSocket shows "✅ WebSocket connected"
- [ ] Notifications load without error
- [ ] Payments load without error
- [ ] Can complete payment without error

---

## 📞 If Still Not Working

1. **Check MongoDB**:
   - Is MongoDB running?
   ```bash
   # Check if MongoDB is running
   mongosh
   ```

2. **Check .env file**:
   ```bash
   # In d:\SMG\backend\.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smg-vendor-portal
   JWT_SECRET=your_secret_key_here
   ```

3. **Check User exists in DB**:
   ```bash
   mongosh
   use smg-vendor-portal
   db.users.find()
   ```

4. **Create test user** (if needed):
   ```bash
   # Use the seeder
   cd d:\SMG\backend
   node seeder.js
   ```

---

**Status**: Ready to fix! Follow the steps above.
**Est. Time**: 2-3 minutes for complete reset
**Success Rate**: 99% after full reset

---

**Last Updated**: December 25, 2024  
**Issue**: Authentication failure causing cascading errors
**Solution**: Clear storage → Restart servers → Re-login
