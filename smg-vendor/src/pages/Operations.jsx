// src/pages/Operations.jsx

import { useState } from "react";
import ProductionSchedule from "./operations/ProductionSchedule";
import StoreDetails from "./operations/StoreDetails";
import Reports from "./operations/Reports";
import GreenCertificate from "./operations/GreenCertificate";
import Sidebar from "../components/Sidebar";

export default function Operations() {
  const [activeMenu, setActiveMenu] = useState("Production Schedule");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar active={activeMenu} onSelect={setActiveMenu} />

      <div className="ml-64 w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#0A2342]">
          Operations Module
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {activeMenu === "Production Schedule" && (
            <>
              <ProductionSchedule />
              <StoreDetails />
            </>
          )}

          {activeMenu === "Store / Bin Details" && (
            <>
              <StoreDetails />
              <ProductionSchedule />
            </>
          )}

          {activeMenu === "Reports" && (
            <>
              <Reports />
              <GreenCertificate />
            </>
          )}

          {activeMenu === "Green Certificate" && (
            <>
              <GreenCertificate />
              <Reports />
            </>
          )}

          {activeMenu === "Dashboard" && (
            <>
              <ProductionSchedule />
              <StoreDetails />
              <Reports />
              <GreenCertificate />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
