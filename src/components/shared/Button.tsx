"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary:
      "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm hover:shadow-md hover:shadow-[#4F46E5]/20",
    secondary:
      "bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-white border border-[#27272A]",
    outline:
      "border border-[#27272A] bg-transparent text-[#A1A1AA] hover:bg-[#111111] hover:text-white hover:border-[#3F3F46]",
    ghost:
      "bg-transparent text-[#A1A1AA] hover:bg-[#111111] hover:text-white",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
