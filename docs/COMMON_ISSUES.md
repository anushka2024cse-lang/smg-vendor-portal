# Common Issues & Troubleshooting

Frequently encountered problems and their solutions.

---

## Backend Issues

### 1. Backend won't start

**Error:** `Error: Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
- Check MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- For Atlas: Check IP whitelist
- Try: `net start MongoDB` (Windows)

---

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

### 2. Email not sending

**Error:** `Invalid login: 535 Authentication failed`

**Solutions:**
- Use Gmail App Password, NOT regular password
- Enable 2-Factor Authentication first
- Verify EMAIL_USER and EMAIL_PASS in `.env`
- Check for typos in app password (no spaces)

---

**Error:** `self signed certificate in certificate chain`

**Solution:**
```javascript
// In email config (development only)
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
},
tls: {
    rejectUnauthorized: false // Add this for dev
}
```

---

### 3. Database errors

**Error:** `MongooseServerSelectionError`

**Solutions:**
- Restart MongoDB service
- Check connection string format
- Verify database user permissions
- Try connection with MongoDB Compass

---

**Error:** `E11000 duplicate key error`

**Solution:**
```bash
# Drop the index causing issues
mongo
use smg-vendor-portal
db.collection.dropIndex("index_name")
```

---

## Frontend Issues

### 1. Frontend won't start

**Error:** `Module not found: Error: Can't resolve 'react'`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Change port in package.json
"dev": "vite --port 3001"

# Or kill process
npx kill-port 3000
```

---

### 2. API connection issues

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solutions:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env`
- Ensure no CORS issues (check backend console)
- Try: `curl http://localhost:5000/api/v1/notifications`

---

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solution:**
```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
```

---

### 3. Build errors

**Error:** `RollupError: Could not resolve './component'`

**Solution:**
- Check import paths are correct
- Verify file extensions (.jsx, .js)
- Use absolute imports or aliases

---

## Notification Issues

### 1. Notifications not appearing

**Problem:** Bell icon shows no notifications

**Debug Steps:**
```javascript
// Check API
fetch('http://localhost:5000/api/v1/notifications')
  .then(r => r.json())
  .then(console.log);

// Check recipient ID
// Notifications should have recipient: "temp-user-id"
```

**Solutions:**
- Verify backend is running
- Check recipient field matches
- Open browser DevTools → Network tab
- Look for API call to `/notifications`

---

### 2. Toast notifications not showing

**Solutions:**
- Verify ToastProvider wraps App component
- Check useToast hook is imported
- Look for console errors
- Ensure z-index is high enough

---

### 3. Email notifications not received

**Debug Steps:**
1. Check backend logs for email errors
2. Verify EMAIL_PASS is app password
3. Test email service:
```bash
curl -X POST http://localhost:5000/api/v1/notifications \
  -H "Content-Type: application/json" \
  -d '{"sendEmail":true,"userEmail":"your@email.com",...}'
```

---

## Development Issues

### 1. Hot reload not working

**Vite not reloading:**
```javascript
// vite.config.js
server: {
    watch: {
        usePolling: true
    }
}
```

**Nodemon not restarting:**
```json
// package.json
"dev": "nodemon --ext js,json server.js"
```

---

### 2. Environment variables not loading

**Solutions:**
- File must be named exactly `.env`
- No quotes around values
- Restart dev server after changes
- Use `process.env.VARIABLE_NAME`
- For Vite: prefix with `VITE_`

---

### 3. Git issues

**Error:** `Your local changes would be overwritten`

**Solution:**
```bash
git stash
git pull
git stash pop
```

---

## Performance Issues

### 1. Slow API responses

**Solutions:**
- Add database indexes
- Use pagination
- Optimize queries
- Check network inspector

---

### 2. Frontend lag

**Solutions:**
- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Check for memory leaks

---

## Production Issues

### 1. Build fails

**Error:** `JavaScript heap out of memory`

**Solution:**
```json
//package.json
"build": "node --max-old-space-size=4096 node_modules/vite/bin/vite.js build"
```

---

### 2. Environment variables not working

**Solutions:**
- Rebuild after changing env vars
- For Vercel: Add to dashboard
- For Heroku: Use `heroku config:set`
- Don't commit `.env` to git

---

## Debugging Tips

### Enable verbose logging

**Backend:**
```javascript
// server.js
const morgan = require('morgan');
app.use(morgan('dev'));
```

**Frontend:**
```javascript
// Enable React DevTools
// Enable Redux DevTools (if using)
```

### Check logs

**Backend:**
```bash
# View real-time logs
npm run dev

# Add debug logs
console.log('Debug:', variable);
```

**Frontend:**
```javascript
// Browser console
console.table(data);
console.trace();
```

### Network debugging

**Chrome DevTools:**
1. F12 → Network tab
2. Filter by Fetch/XHR
3. Check request/response
4. Look for errors (red)

---

## Still Having Issues?

1. **Check logs:** Backend terminal + Browser console
2. **Verify environment:** Node version, npm version
3. **Clean install:**
```bash
rm -rf node_modules package-lock.json
npm install
```

4. **Ask for help:** Provide error messages and logs

---

## Useful Commands

```bash
# Check Node/npm versions
node --version
npm --version

# Check what's running on a port
netstat -ano | findstr :5000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check MongoDB status
mongod --version
mongo --eval "db.version()"

# Test backend endpoint
curl http://localhost:5000/api/v1/notifications

# View environment variables
# Windows
echo %VARIABLE_NAME%
# Mac/Linux
echo $VARIABLE_NAME
```

---

## Error Code Reference

| Code | Meaning | Common Cause |
|------|---------|-------------|
| 400 | Bad Request | Invalid data sent |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Wrong endpoint |
| 500 | Server Error | Backend crash |
| ECONNREFUSED | Connection refused | Backend not running |
| EADDRINUSE | Port in use | Process already running |

---

Need more help? Check [API Reference](./API_REFERENCE.md) or [Environment Setup](./ENVIRONMENT_SETUP.md)
