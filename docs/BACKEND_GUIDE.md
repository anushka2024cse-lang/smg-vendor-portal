# 📘 SMG Vendor Portal: The Complete Backend Guide

> **Version**: 2.0 (Production Ready)
> **Stack**: MERN (MongoDB, Express, React, Node.js)

This document is the **single source of truth** for building, securing, and deploying the backend of the SMG Vendor Portal. It combines architectural blueprints with step-by-step implementation instructions.

---

## 🏗️ Part 1: Architecture & Design

### 1.1 High-Level Architecture

We utilize a **Service-Oriented Architecture** where the React Frontend communicates with a stateless Node.js REST API, which persists data to a MongoDB Cloud Cluster.

```mermaid
graph TD
    User[User / Vendor] --> Client[React Frontend]
    Client -- "HTTPS / JSON (JWT)" --> API[Express REST API]
    
    subgraph "Backend Infrastructure"
        API --> Auth[Auth Middleware]
        Auth --> Controller[Business Logic]
        Controller --> Mongoose[Data Models]
        Mongoose --> DB[(MongoDB Atlas)]
    end
    
    subgraph "External Services"
        Client --> Storage[Firebase Storage (Images)]
        API --> Mail[Email Service (Optional)]
    end
```

### 1.2 Database Schema Design

Structure of our NoSQL Collections.

#### `users` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Full Name |
| `email` | String | Unique Login Email (Indexed) |
| `password` | String | Bcrypt Hashed Password |
| `role` | Enum | `Super Admin`, `Admin`, `User`, `Vendor` |
| `status` | Enum | `Active`, `Suspended` |

#### `inventory` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Item Name (e.g. "Brake Pad") |
| `sku` | String | Stock Keeping Unit (Unique) |
| `quantity` | Number | Current physical count |
| `location` | String | Warehouse Bin ID |
| `minLevel` | Number | Low stock alert threshold |
| `category` | String | e.g. "Raw Material", "Finished Goods" |

#### `transactions` Collection (Audit Trail)
| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | Enum | `RECEIPT` (GRN) or `DISPATCH` (Issue) |
| `items` | Array | List of `{ itemId, qty }` |
| `user` | ObjectId | Reference to `users` who performed action |
| `reference`| String | PO Number or Job Card ID |
| `date` | Date | Timestamp |

---

## 🛠️ Part 2: Implementation Guide (Step-by-Step)

### Phase 1: Environment Setup

#### 1. Dependencies
The `backend/` folder requires these specific packages:
```bash
cd backend
npm install express mongoose cors dotenv helmet morgan jsonwebtoken bcryptjs express-validator
npm install --save-dev nodemon
```
- **Security**: `helmet` (headers), `bcryptjs` (hashing).
- **Utils**: `morgan` (logging), `cors` (cross-origin).

#### 2. Configuration (`.env`)
Create `backend/.env` with your secrets:
```env
PORT=5000
NODE_ENV=development
# Get this from MongoDB Atlas
MONGO_URI=mongodb+srv://admin:password@cluster.mongodb.net/smg_portal
# Generate a random 32-char string
JWT_SECRET=super_secret_key_change_me_in_prod
```

### Phase 2: Core Server Structure

#### 1. Database Connection (`config/db.js`)
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
module.exports = connectDB;
```

#### 2. Server Entry Point (`server.js`)
```javascript
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
// ... middleware imports

// Connect DB
connectDB();

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(require('cors')());
app.use(require('helmet')());

// Mount Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/inventory', require('./routes/inventoryRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
```

### Phase 3: Security & Authentication

#### 1. User Model (`models/User.js`)
Implement `pre('save')` hooks to hash passwords automatically.

#### 2. Auth Middleware (`middleware/auth.js`)
Protect routes by verifying the JWT token sent in headers.
```javascript
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
```

### Phase 4: Business Logic (Service Layer)

#### 1. Inventory Logic (`controllers/inventoryController.js`)
*   **Get All**: Support pagination (`?page=1&limit=10`).
*   **Receive Material**:
    *   Validate PO Number.
    *   Create `Transaction` record (`type: RECEIPT`).
    *   Increment `Inventory` count using `$inc`.
*   **Dispatch Material**:
    *   Check `Stock >= Requested`.
    *   Create `Transaction` record (`type: DISPATCH`).
    *   Decrement `Inventory`.

---

## 🚀 Part 3: Deployment & Integration

### 3.1 Frontend Integration
In your React app (`src/services/config.js`), point to the production API:
1.  Set `VITE_USE_MOCK=false` in `.env`.
2.  Set `VITE_API_BASE_URL=https://your-backend-app.onrender.com/api/v1`.

### 3.2 Deployment Checklist (Go Live)

1.  **Database**:
    *   Whitelisting: In MongoDB Atlas, allow IP `0.0.0.0/0` (or specific Render IP).
    *   User: Ensure `smg_admin` user has `readWrite` access.
2.  **Backend (Render/Heroku/Railway)**:
    *   Set Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) in the dashboard.
    *   Build Command: `npm install`.
    *   Start Command: `node server.js`.
3.  **Frontend (Vercel/Netlify)**:
    *   Build Command: `npm run build`.
    *   Output Directory: `dist`.
    *   Environment Variable: `VITE_API_BASE_URL` pointing to your Backend URL.

---

## 🔮 Future Roadmap
*   **Email Notifications**: Send alerts via SendGrid when stock < minLevel.
*   **Role-Based Access Control (RBAC)**: Fine-grained permissions (e.g., only "Manager" can approve POs).
*   **Audit Logs**: detailed logging of user IP addresses and actions.
