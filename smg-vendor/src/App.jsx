import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import DashboardLayout from './components/DashboardLayout'
import Requests from './pages/Requests'
import WarrantyClaim from './pages/WarrantyClaim'
import FailedPart from './pages/FailedPart'
import Operations from './pages/Operations'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={
            <div className="text-center mt-20">
              <h1 className="text-3xl font-bold text-[#1B365D]">Welcome to Vendor Portal</h1>
              <p className="text-gray-500 mt-2">Select an option from the sidebar to get started.</p>
            </div>
          } />
          <Route path="/requests" element={<Requests />} />
          <Route path="/warranty-claim" element={<WarrantyClaim />} />
          <Route path="/failed-part" element={<FailedPart />} />
          <Route path="/operations" element={<Operations />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
