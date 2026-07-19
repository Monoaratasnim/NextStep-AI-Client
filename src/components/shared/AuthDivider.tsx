"use client";

import React from "react";

interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = "Or continue with" }: AuthDividerProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider">
        <span className="bg-transparent px-3 text-zinc-400 dark:text-zinc-500">
          {label}
        </span>
      </div>
    </div>
  );
}
