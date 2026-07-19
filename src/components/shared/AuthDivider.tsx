"use client";

import React from "react";

interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = "Or continue with" }: AuthDividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#27272A]" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-[#111111] px-3 text-[#71717A]">
          {label}
        </span>
      </div>
    </div>
  );
}
