# SMG Vendor Portal - Developer Setup Guide

Follow these steps to set up the project from scratch on a new machine.

## 1. Prerequisites
- **Node.js** (v18 or higher) installed.
- **MongoDB** installed and running locally (or a cloud MongoDB URI).
- **Git** installed.

## 2. Clone the Repository
Open your terminal (Command Prompt / PowerShell / Terminal) and run:
```bash
git clone https://github.com/anushka2024cse-lang/smg-vendor-portal
cd smg-vendor-portal
```

## 3. Project Structure
The project is divided into two main parts:
- **Root (Frontend)**: React + Vite application.
- **Backend Folder**: Express + Node.js API server.

You need to set up both.

---

## 4. Backend Setup (API Server)

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   - Ensure you have a `.env` file in the `backend` folder (or just use default config if applicable).
   - Default Port: `5000`
   - MongoDB URI: `mongodb://localhost:27017/smg` (Default)

4. **Start the Backend Server:**
   ```bash
   npm start
   ```
   *You should see: "Server running on port 5000" and "MongoDB Connected".*

   *(Leave this terminal window open)*

---

## 5. Frontend Setup (React App)

1. **Open a NEW terminal window** (do not close the backend one).

2. **Navigate to the project root:**
   ```bash
   cd smg-vendor-portal
   ```
   *(If you are already in the root, skip this)*

3. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

4. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```

5. **Access the App:**
   - Ctrl + Click the local URL shown in the terminal (usually **http://localhost:5173**).

---

## Summary of Commands (Quick Start)

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
npm install
npm run dev
```
