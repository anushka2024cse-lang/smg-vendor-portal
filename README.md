# SMG Vendor Portal (MMP)


![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-14+-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## 📖 Project Overview

The **SMG Vendor Portal (Material Management Portal)** is a high-fidelity web application designed to streamline supply chain operations. This codebase implements the **Frontend UI** with a focus on modern aesthetics (Dark Mode), modular architecture, and comprehensive administrative features.

### ✨ Key Features
- **📊 Interactive Dashboard**: Real-time analytics, inventory charts, and stock value tracking
- **📦 Inventory Management**: Complete CRUD operations for parts, including Receipt (GRN) and Dispatch workflows.
- **🏭 Production Planning**: Production history logging and AI-powered forecasting inputs.
- **🛡️ Admin Suite**: User management with custom roles, secure profile views, and activity logs.
- **🎧 Support Center**: Integrated ticketing system with status tracking and FAQ knowledge base.
- **🎨 Modern UI/UX**: Fully responsive Dark Theme using Tailwind CSS v4 and Lucide icons.

---

## 🛠️ Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 | Component-based UI library |
| **Bundler** | Vite 6+ | Next-generation frontend tooling |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework |
| **Icons** | Lucide React | Clean and consistent icon set |
| **Visualization** | Recharts | Composable charting library |
| **HTTP Client** | Axios | Promise-based HTTP client for browser/node |
| **Data Export** | XLSX (SheetJS) | Spreadsheet parser and generator |

---

## 📂 Project Structure

```text
src/
├── global/
│   └── components/   # Application-wide UI (Sidebar, Layouts, Buttons)
├── pages/
│   ├── Admin/        # User Management & Admin Settings
│   ├── Inventory/    # Stock Levels, Receive, Dispatch
│   ├── Production/   # Production History & Data Entry
│   ├── Forecasting/  # AI Prediction Modules
│   ├── Support/      # Help Center & Ticketing
│   ├── Vendors/      # Vendor Profiles & Management
│   └── Dashboard/    # Main Analytics View
├── services/         # API Integration Layer
│   ├── apiClient.js  # Axios configurations & Interceptors
│   ├── endpoints.js  # Centralized API Routes
│   └── *.service.js  # Module-specific services (admin, inventory, etc.)
├── mocks/            # Mock Data for development
└── App.jsx           # Main Router Configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd smg-vendor
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Base URL for the Backend API
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Optional: Enable Mock Data globally (if supported)
VITE_USE_MOCK=true
```

### 3. Disabling Mock Data (for Production)
By default, the application may use mock data for development. To switch to the real backend:

1.  **Update Environment**: Ensure `VITE_USE_MOCK=false` in your `.env` file.
2.  **Service Config**: Check `src/services/*.service.js` and set the mock flag to false:
    ```javascript
    // In src/services/adminService.js (and others)
    const USE_MOCK = false; 
    ```
    *This ensures the app communicates directly with your `VITE_API_BASE_URL`.*

### 4. Running the Frontend
Start the development server:
```bash
npm run dev
```
Access the app at `http://localhost:5173`.

---

## 🔗 Backend Integration

To power this frontend, a **Node.js + Express** backend is required.

### Recommended Backend Setup

1.  **Initialize**: `npm init -y` inside a `backend/` folder.
2.  **Install**: `npm i express cors dotenv mongoose jsonwebtoken`
3.  **Server Entry (`server.js`)**:
    ```javascript
    const express = require('express');
    const cors = require('cors');
    const app = express();

    app.use(cors()); // Enable CORS for frontend access
    app.use(express.json());

    // Define Routes
    app.use('/api/v1/auth', require('./routes/auth'));
    app.use('/api/v1/admin', require('./routes/admin'));
    // ... other routes

    app.listen(5000, () => console.log('Server running on port 5000'));
    ```

### � API Endpoints Reference

Ensure your backend implements these core endpoints defined in `src/services/endpoints.js`.

| Module | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/login` | POST | Authenticate user & return JWT |
| | `/auth/me` | GET | Validates token & returns profile |
| **Dashboard** | `/dashboard/metrics` | GET | Stats cards (Total Stock, Value) |
| | `/dashboard/inventory-chart` | GET | Data for main line chart |
| **Inventory** | `/materials/receive` | POST | Create GRN (Good Receipt Note) |
| | `/materials/dispatch` | POST | Create Material Issue Slip |
| **Admin** | `/admin/users` | GET | List all users |
| | `/admin/users` | POST | Create new Admin/User |
| **Support** | `/support/tickets` | GET | Fetch support tickets |

---

## 🤝 Contributing

1.  Create a Feature Branch (`git checkout -b feature/AmazingFeature`)
2.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
3.  Push to the Branch (`git push origin feature/AmazingFeature`)
4.  Open a Pull Request

---
*Maintained by SMG Development Team*
