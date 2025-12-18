import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { VendorFormProvider } from "./context/VendorFormContext";

import VendorVendorPage from "./pages/VendorVendorPage";
import VendorStep3 from "./pages/VendorStep3";

function App() {
  return (
    <VendorFormProvider>
      <Router>
        <Routes>

          {/* Default route → open merged vendor form */}
          <Route path="/" element={<Navigate to="/vendor/form" replace />} />

          {/* PAGE 1 (Vendor fills) */}
          <Route path="/vendor/form" element={<VendorVendorPage />} />

          {/* PAGE 2 (Accounting Dept) */}
          <Route path="/vendor/step3" element={<VendorStep3 />} />

        </Routes>
      </Router>
    </VendorFormProvider>
  );
}

export default App;
