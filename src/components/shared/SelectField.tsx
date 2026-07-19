"use client";

import React from "react";

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function SelectField({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}: SelectFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-[#A1A1AA]"
      >
        {label}
      </label>
      <select
        id={fieldId}
        className={`w-full appearance-none rounded-xl bg-[#111111] border border-[#27272A] text-white placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 py-2.5 px-4 text-sm ${
          error
            ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
            : "focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
