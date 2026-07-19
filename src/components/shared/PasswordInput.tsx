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
        className="block text-sm font-medium text-[#A1A1AA]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className={`w-full rounded-xl bg-[#111111] border border-[#27272A] text-white placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 py-2.5 px-4 pr-11 text-sm ${
            error
              ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
              : "focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#71717A] hover:text-white transition-colors"
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
        <p className="text-xs text-rose-400">{error}</p>
      )}
    </div>
  );
}
