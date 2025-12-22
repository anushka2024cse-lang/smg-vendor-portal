# 🗺️ SMG Vendor Portal - Codebase Structure Guide

> **A simple guide to understand where everything is and how it all connects**

---

## 📂 Project Overview

```
SMG Vendor Portal
│
├── 🎨 Frontend (React)  ← What users see and interact with
│   └── Located in: d:\SMG\src\
│
└── ⚙️ Backend (Node.js)  ← Where data is stored and processed
    └── Located in: d:\SMG\backend\
```

---

## 🎨 FRONTEND STRUCTURE (src/)

### 📁 Main Folders

```
src/
│
├── 📄 pages/              ← All the screens/pages users see
│   ├── Dashboard/         → Home page
│   ├── Vendor/            → Vendor management pages
│   ├── Procurement/       → Purchase orders, SOR
│   ├── Inventory/         → Stock management
│   ├── Payments/          → Payment tracking
│   ├── Settings/          → User settings
│   └── ComponentDetails/  → Component management
│
├── 🔌 services/           ← Connection to backend (API calls)
│   ├── apiClient.js       → Main connector to backend
│   ├── sorService.js      → SOR-specific API calls
│   ├── componentService.js→ Component API calls
│   └── authService.js     → Login/logout
│
├── 🧩 global/             ← Reusable parts used everywhere
│   └── components/        → Header, Sidebar, etc.
│
└── 📱 App.jsx             ← Main file that loads everything
```

---

## 🔄 HOW FRONTEND CONNECTS TO BACKEND

### Simple Data Flow:

```
USER CLICKS BUTTON
    ↓
PAGE (e.g., CreateSor.jsx)
    ↓
CALLS SERVICE (e.g., sorService.create())
    ↓
SERVICE TALKS TO BACKEND via apiClient
    ↓
BACKEND PROCESSES REQUEST
    ↓
BACKEND SENDS DATA BACK
    ↓
PAGE SHOWS RESULT TO USER
```

### Example: Creating a New SOR

```
1. User fills form in:     CreateSor.jsx
                            ↓
2. Form calls:             sorService.create(data)
                            ↓
3. sorService uses:        apiClient.post('/api/v1/sor', data)
                            ↓
4. Request goes to:        BACKEND /api/v1/sor
                            ↓
5. Backend saves to:       MongoDB Database
                            ↓
6. Success message back to: CreateSor.jsx
                            ↓
7. User sees:              "SOR created successfully!"
```

---

## ⚙️ BACKEND STRUCTURE (backend/)

### 📁 Main Folders

```
backend/
│
├── 📋 models/             ← Database table definitions
│   ├── SOR.js            → What a SOR looks like in database
│   ├── Component.js      → What a Component looks like
│   ├── Vendor.js         → Vendor information structure
│   └── User.js           → User account structure
│
├── 🎯 routes/            ← URL paths (where to send requests)
│   ├── sor.js            → /api/v1/sor/*
│   ├── components.js     → /api/v1/components/*
│   ├── vendor.js         → /api/v1/vendors/*
│   └── auth.js           → /api/v1/auth/*
│
├── 🔧 controllers/       ← Business logic (what to do)
│   ├── sorController.js  → Create, Read, Update, Delete SOR
│   ├── vendorController.js→ Vendor operations
│   └── authController.js → Login, register, password reset
│
├── 🛡️ middleware/        ← Security & validation
│   └── auth.js           → Check if user is logged in
│
├── ⚙️ config/            ← Settings
│   └── db.js             → Database connection
│
└── 🚀 server.js          ← MAIN FILE - Starts everything
```

---

## 🔗 BACKEND FILE RELATIONSHIPS

### How Backend Files Connect:

```
server.js (MAIN)
    │
    ├─→ Connects to: config/db.js (Database)
    │
    └─→ Loads routes: routes/sor.js
                      routes/components.js
                      routes/vendor.js
                      routes/auth.js
```

### Example: SOR Module Connection

```
REQUEST: POST /api/v1/sor
    ↓
1. server.js receives it
    ↓
2. Routes to: routes/sor.js
    ↓
3. sor.js calls: controllers/sorController.createSOR()
    ↓
4. Controller uses: models/SOR.js
    ↓
5. Model saves to: MongoDB Database
    ↓
6. Response sent back through same path
```

---

## 📊 COMPLETE DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTS                         │
│                    (Browser - localhost:3000)               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PAGES (What user sees)                              │  │
│  │  • CreateSor.jsx                                     │  │
│  │  • SORList.jsx                                       │  │
│  │  • ComponentDetails.jsx                              │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│                 ↓                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  SERVICES (API Connectors)                           │  │
│  │  • sorService.js ────┐                               │  │
│  │  • componentService.js ──┐                           │  │
│  │  • apiClient.js (MAIN)   │                           │  │
│  └──────────────┬───────────┴───────────────────────────┘  │
└─────────────────┼──────────────────────────────────────────┘
                  │
                  │ HTTP Request
                  │ (to localhost:5000/api/v1/...)
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  server.js (ENTRY POINT)                             │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│                 ↓                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ROUTES (URL Handlers)                               │  │
│  │  • /api/v1/sor         → routes/sor.js               │  │
│  │  • /api/v1/components  → routes/components.js        │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│                 ↓                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CONTROLLERS (Logic)                                 │  │
│  │  • sorController.js (Create, Read, Update, Delete)   │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                           │
│                 ↓                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MODELS (Database Structure)                         │  │
│  │  • SOR.js (defines what SOR looks like)              │  │
│  └──────────────┬───────────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
│             (Stores all your data permanently)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 FILE PURPOSE - QUICK REFERENCE

### Frontend Files Purpose:

| File | What It Does | Connects To |
|------|-------------|-------------|
| **CreateSor.jsx** | Form to create new SOR | → sorService.js |
| **SORList.jsx** | Shows list of all SORs | → sorService.js |
| **SORWorkspace.jsx** | Edit existing SOR | → sorService.js |
| **sorService.js** | Sends SOR data to backend | → Backend API |
| **apiClient.js** | Main bridge to backend | → Backend server.js |
| **App.jsx** | Loads all pages & routes | → All pages |

### Backend Files Purpose:

| File | What It Does | Connects To |
|------|-------------|-------------|
| **server.js** | Starts the backend server | → All routes |
| **routes/sor.js** | Defines /api/v1/sor/* URLs | → sorController.js |
| **controllers/sorController.js** | Business logic for SOR | → models/SOR.js |
| **models/SOR.js** | SOR database structure | → MongoDB |
| **config/db.js** | Connects to database | → MongoDB |

---

## 🚀 WHAT HAPPENS WHEN YOU RUN THE APP

### Starting Frontend (Port 3000):
```bash
npm run dev (in d:\SMG)
    ↓
Vite starts dev server
    ↓
Opens App.jsx
    ↓
Loads all pages
    ↓
Browser shows: http://localhost:3000
```

### Starting Backend (Port 5000):
```bash
npm run dev (in d:\SMG\backend)
    ↓
nodemon starts server.js
    ↓
Connects to MongoDB
    ↓
Loads all routes
    ↓
API ready at: http://localhost:5000
```

---

## 🎨 COLOR CODE

- 🎨 **Blue/Purple** = Frontend (User Interface)
- ⚙️ **Orange/Red** = Backend (Server/API)
- 💾 **Green** = Database
- 🔌 **Yellow** = Services (Connectors)

---

## 📝 REAL-WORLD EXAMPLE: Following a Request

### Scenario: User creates a new SOR

```
Step 1: User fills form
📍 Location: d:\SMG\src\pages\Procurement\SOR\CreateSor.jsx
Action: User clicks "Submit for Review"

Step 2: Frontend sends data
📍 Location: d:\SMG\src\services\sorService.js
Action: sorService.create(formData)

Step 3: Data goes to backend
📍 Route: POST http://localhost:5000/api/v1/sor
Action: HTTP request sent

Step 4: Backend receives request
📍 Location: d:\SMG\backend\server.js
Action: Routes to: /api/v1/sor

Step 5: Route handler
📍 Location: d:\SMG\backend\routes\sor.js
Action: Calls: sorController.createSOR()

Step 6: Controller processes
📍 Location: d:\SMG\backend\controllers\sorController.js
Action: Creates new SOR using SOR model

Step 7: Model saves to database
📍 Location: d:\SMG\backend\models\SOR.js
Action: Saves to MongoDB

Step 8: Success response
Goes back through: Model → Controller → Route → API → Service → Page

Step 9: User sees success!
📍 Location: CreateSor.jsx
Action: Shows "SOR created successfully!"
```

---

## 🔍 HOW TO FIND THINGS

### "I want to change the SOR creation form"
→ Go to: `d:\SMG\src\pages\Procurement\SOR\CreateSor.jsx`

### "I want to change how SOR data is saved"
→ Go to: `d:\SMG\backend\controllers\sorController.js`

### "I want to add a new field to SOR"
→ Go to: `d:\SMG\backend\models\SOR.js`

### "I want to change the SOR list table"
→ Go to: `d:\SMG\src\pages\Procurement\SOR\SORList.jsx`

### "I want to add a new API endpoint"
→ Go to: `d:\SMG\backend\routes\sor.js`

---

## 📚 SUMMARY

**Simple Rules:**
1. **Pages** = What users see (Frontend)
2. **Services** = Bridges to backend (Frontend)
3. **Routes** = URL paths (Backend)
4. **Controllers** = What to do (Backend)
5. **Models** = Database structure (Backend)

**Data always flows:**
Page → Service → API → Route → Controller → Model → Database

And back:
Database → Model → Controller → Route → API → Service → Page

---

## 🆘 TROUBLESHOOTING

| Problem | Check This |
|---------|-----------|
| Frontend won't start | `npm run dev` in `d:\SMG` |
| Backend won't start | `npm run dev` in `d:\SMG\backend` |
| Can't see new SOR | Check if backend running (port 5000) |
| Database error | Check MongoDB connection in `.env` |
| API not working | Check `d:\SMG\backend\server.js` routes |

---

**Last Updated:** December 22, 2024  
**For Questions:** Check this guide first, then ask! 😊
