# SMG Vendor Portal - Roshan Branch

## 🚀 Branch Overview
This branch (`roshan`) contains the **Frontend** implementation of the SMG Vendor Portal, built with the latest modern web technologies. It focuses on a high-fidelity dark-themed UI, modular component architecture, and comprehensive admin/support features.

### 🛠️ Frontend Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite 6+
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Export**: XLSX (SheetJS)
- **HTTP Client**: Axios

---

## 🏗️ Backend Implementation & Structure

To support this frontend, you need a Node.js & Express.js backend. Below is the recommended structure and setup guide.

### 1. Recommended Project Structure
```text
backend/
├── src/
│   ├── config/
│   │   └── db.js           # Database connection (MongoDB/PostgreSQL)
│   ├── controllers/        # Request logic (e.g., authController.js)
│   ├── middleware/         # Auth & Error handling (authMiddleware.js)
│   ├── models/             # Database Schemas (User.js, Ticket.js)
│   ├── routes/             # API Routes (authRoutes.js, adminRoutes.js)
│   └── app.js              # Express App setup
├── .env                    # Environment variables (PORT, DB_URI, JWT_SECRET)
├── package.json
└── server.js               # Entry point
```

### 2. Setting Up Node.js & Express.js
Run the following commands in your `backend/` folder:

1.  **Initialize Project**:
    ```bash
    npm init -y
    ```
2.  **Install Dependencies**:
    ```bash
    npm install express cors dotenv mongoose jsonwebtoken bcryptjs
    npm install --save-dev nodemon
    ```
3.  **Configure `server.js`**:
    ```javascript
    require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Import Routes
    app.use('/api/v1/auth', require('./src/routes/authRoutes'));
    app.use('/api/v1/admin', require('./src/routes/adminRoutes'));
    // ... load other routes

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    ```
4.  **Start Server**:
    ```bash
    npx nodemon server.js
    ```

---

## 🔌 API Endpoints Reference

The frontend expects the following RESTful API endpoints. Ensure your backend routes match these paths (configured via `.env` `VITE_API_BASE_URL`).

### **Authentication**
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | User login | `{ email, password }` |
| `GET` | `/auth/me` | Get current user profile | `Headers: { Authorization: Bearer <token> }` |

### **Dashboard**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/dashboard/metrics` | Key performance indicators (Total Stock, Value) |
| `GET` | `/dashboard/inventory-chart` | Data for main dashboard chart |
| `GET` | `/dashboard/stock-distribution` | Pie chart data for stock categories |
| `GET` | `/dashboard/low-stock` | List of items below reorder level |

### **Admin & Users**
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | List all system users | - |
| `POST` | `/admin/users` | Create a new user | `{ name, email, password, role }` |

### **Inventory & Materials**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/inventory` | Full inventory list |
| `GET` | `/models` | List of defined product models |
| `POST` | `/materials/receive` | Process new inbound material |
| `POST` | `/materials/dispatch` | Process outbound material dispatch |

### **Production & Forecasting**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/production/history` | Historical production data |
| `POST` | `/production/generate` | Trigger production planning calculation |
| `POST` | `/forecasting/generate` | Trigger AI stock prediction |

### **Vendors**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/vendors` | List of all registered vendors |
| `GET` | `/vendors/:id` | Detailed view of a specific vendor |

---

## 🏃‍♂️ How to Run the Frontend

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Start Development Server**:
    ```bash
    npm run dev
    ```
3.  **Build for Production**:
    ```bash
    npm run build
    ```
