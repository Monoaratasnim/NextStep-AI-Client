"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function PasswordInput({
  label,
  error,
  className = "",
  id,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 ${
            error
              ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-700 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
              : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-400/20 dark:border-zinc-800 dark:focus:border-zinc-600 dark:focus:ring-zinc-600/20"
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}
