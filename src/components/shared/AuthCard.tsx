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
      className={`relative bg-[#111111] border border-[#27272A] rounded-2xl p-8 sm:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
