import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * FormNav shows Back / Next / Submit
 * step: number (1/2/3)
 */
export default function FormNav({ step = 1 }) {
  const nav = useNavigate();
  return (
    <div className="flex justify-end gap-3 mt-6">
      {step > 1 && (
        <button
          type="button"
          onClick={() => nav(-1)}
          className="px-4 py-2 border rounded text-sm bg-white hover:bg-gray-50"
        >
          Back
        </button>
      )}
      <button
        type="submit"
        className="px-4 py-2 bg-[#0c2444] text-white rounded text-sm hover:bg-[#0b233f]"
      >
        {step === 1 ? "Next" : step === 3 ? "Submit" : "Next"}
      </button>
    </div>
  );
}
