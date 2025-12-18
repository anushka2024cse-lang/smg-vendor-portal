import React from "react";

/**
 * FileUpload
 * - Pure Tailwind
 * - Supports multiple files
 * - Stores File objects in context
 */
export default function FileUpload({
  value = [],
  onChange,
  accept = "application/pdf",
  multiple = true,
  label,
}) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    onChange && onChange(multiple ? [...value, ...files] : files);
    e.target.value = null;
  };

  const remove = (index) => {
    const next = [...value];
    next.splice(index, 1);
    onChange && onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFiles}
        className="block w-full text-sm text-gray-700
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-medium
                   file:bg-gray-100 file:text-gray-700
                   hover:file:bg-gray-200"
      />

      {value.length > 0 && (
        <ul className="space-y-1 text-sm text-gray-700">
          {value.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3"
            >
              <span className="truncate">{f?.name || `file-${i + 1}`}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
