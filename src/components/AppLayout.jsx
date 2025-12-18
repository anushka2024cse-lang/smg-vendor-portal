// src/components/AppLayout.jsx
import React from "react";
import Logo from "./Logo";

/**
 * AppLayout
 * - Common layout for ALL pages
 * - Sidebar + header style container
 * - Light grey background
 * - Centers PageCard horizontally (not vertically)
 */
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#F3F4F6]">
      {/* ================= Sidebar ================= */}
      <aside className="hidden md:flex w-60 bg-[#1F3A63] flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Logo />
        </div>

        {/* Navigation (future ready) */}
        <nav className="flex-1 px-4 py-6 text-sm text-white/80 overflow-y-auto">
          {/* Sidebar items will come here */}
        </nav>
      </aside>

      {/* ================= Main Content ================= */}
      <main className="flex-1 px-4 py-6 md:px-8">
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
