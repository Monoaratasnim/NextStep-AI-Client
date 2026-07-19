"use client";

import React from "react";

interface PasswordStrengthProps {
  password: string;
}

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Strong", color: "bg-emerald-500" };
  return { score, label: "Very Strong", color: "bg-emerald-400" };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, label, color } = getStrength(password);
  const percentage = (score / 5) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#71717A]">
          Password strength
        </span>
        <span className="text-xs font-medium text-[#A1A1AA]">
          {label}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[#27272A]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
              i < score
                ? color
                : "bg-[#27272A]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
