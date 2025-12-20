# 🔌 Backend Integration & Implementation Guide

This document provides a comprehensive guide on how to set up the backend for the SMG Vendor Portal and connect it to the React frontend.

## 1. Frontend Configuration

### Environment Variables
The frontend uses environment variables to know where to send API requests.

1.  Create a file named `.env` in the root of the frontend (`d:\SMG\branches\roshan\.env`).
2.  Add the following:
    ```env
    # The URL where your backend server is running
    VITE_API_BASE_URL=http://localhost:5000/api/v1
    
    # Set to 'false' to use the Real Backend, 'true' to use Mock Data
    VITE_USE_MOCK=false
    ```

### Disabling Mock Mode
To stop using the fake data and connect to your server:
1.  Go to `src/services/` and open each service file (e.g., `adminService.js`, `inventoryService.js`).
2.  Locate `const USE_MOCK = true;`
3.  Change it to:
    ```javascript
    const USE_MOCK = false; 
    ```
    *(Ideally, this should eventually be controlled solely by `import.meta.env.VITE_USE_MOCK`)*

---

## 2. Backend Implementation (Node.js + Express)

### Prerequisites
- Node.js installed (v16+ recommended).
- MongoDB installed locally or a cloud Atlas URI.

### Step 1: Initialize Project
Create a new folder `backend` outside of the frontend source (or in the root if monorepo).
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv mongoose jsonwebtoken bcryptjs
npm install --save-dev nodemon
```

### Step 2: Server Entry Point (`server.js`)
Create `server.js` with the following basic structure:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors()); // Allow requests from Frontend
app.use(express.json()); // Parse JSON bodies

// Database Connection
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/v1/auth', require('./src/routes/auth'));
app.use('/api/v1/admin', require('./src/routes/admin'));
app.use('/api/v1/inventory', require('./src/routes/inventory'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 3. Required API Endpoints

Your backend **MUST** implement these endpoints to match the frontend calls defined in `src/services/endpoints.js`.

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Expected Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/login` | User Login | `{email, password}` | `{ user, token }` |
| `GET` | `/me` | Verify Token | `Header: Bearer <token>` | `{ user }` |

### 🛡️ Admin (`/api/v1/admin`)
| Method | Endpoint | Description | Expected Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Get all users | - |
| `POST` | `/users` | Create User | `{name, email, password, role}` |
| `PUT` | `/users/:id` | Update User | `{name, email, role}` |
| `DELETE`| `/users/:id` | Delete User | - |

### 📦 Inventory & Materials
| Method | Endpoint | Description | Expected Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/inventory` | List Items | - |
| `POST` | `/inventory` | Add Item | `{name, sku, category, qty...}` |
| `POST` | `/materials/receive` | GRN Entry | `{poId, items: [{id, qty}]}` |
| `POST` | `/materials/dispatch` | Dispatch | `{destination, items: [...]}` |

### 🛠️ Support
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/support/tickets` | List Tickets |
| `POST` | `/support/tickets` | Create Ticket |

---

## 4. Authentication Logic (JWT)

The frontend's `apiClient.js` automatically handles JWTs.
1.  **On Login**: The backend must return a JSON object with a `token`.
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "user": { "id": "1", "name": "Admin" }
    }
    ```
2.  **On Requests**: The frontend sends `Authorization: Bearer <token>`.
3.  **Backend Verification**: Use a middleware to verify this token for protected routes.

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};
```
