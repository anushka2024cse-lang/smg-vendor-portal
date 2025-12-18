// src/components/PageCard.jsx
import React from "react";

/**
 * PageCard
 * - White container for forms & pages
 * - Matches SMG HRMS / Leaves UI
 * - Used inside AppLayout
 */
export default function PageCard({ children }) {
  return (
    <div
      className="
        w-full
        max-w-6xl
        mx-auto
        bg-white
        rounded-lg
        border border-gray-200
        shadow-sm
        px-6 py-6
        md:px-8 md:py-8
      "
    >
      {children}
    </div>
  );
}
