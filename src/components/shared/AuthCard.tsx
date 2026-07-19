"use client";

import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthCard({
  children,
  className = "",
}: AuthCardProps) {
  return (
    <div
      className={`relative rounded-3xl border border-zinc-200/60 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/80 dark:shadow-zinc-900/20 sm:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
