"use client";

import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({
  label,
  error,
  className = "",
  id,
  ...props
}: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={fieldId}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 ${
          error
            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-700 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
            : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400/20 dark:border-zinc-800 dark:focus:border-zinc-600 dark:focus:ring-zinc-600/20"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
