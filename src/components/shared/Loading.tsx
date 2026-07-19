import React from "react";
import { Loader2 } from "lucide-react";

export function Spinner({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  return (
    <Loader2
      className={`animate-spin text-[#71717A] ${sizes[size]} ${className}`}
    />
  );
}

export function LoadingPage({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Spinner size="lg" />
      {message && (
        <p className="mt-4 text-sm text-[#71717A]">
          {message}
        </p>
      )}
    </div>
  );
}

export function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[#111111] ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <SkeletonBlock className="h-24 rounded-2xl" />

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock className="h-24 rounded-2xl" />
        <SkeletonBlock className="h-24 rounded-2xl" />
        <SkeletonBlock className="h-24 rounded-2xl" />
      </div>

      {/* Skills */}
      <SkeletonBlock className="h-28 rounded-2xl" />

      {/* AI status cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonBlock className="h-20 rounded-2xl" />
        <SkeletonBlock className="h-20 rounded-2xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-8 w-48 rounded-lg" />
      <SkeletonBlock className="h-8 w-72 rounded-lg" />

      <SkeletonBlock className="h-48 rounded-2xl" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonBlock className="h-20 rounded-2xl" />
        <SkeletonBlock className="h-20 rounded-2xl" />
        <SkeletonBlock className="h-20 rounded-2xl" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#27272A] bg-[#111111] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#27272A]">
        <Icon className="h-7 w-7 text-[#71717A]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[#71717A] max-w-md mx-auto">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/20 border border-rose-500/20">
        <svg
          className="h-7 w-7 text-rose-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">
        {title || "Something went wrong"}
      </h3>
      <p className="mt-1 text-sm text-[#71717A]">
        {message}
      </p>
    </div>
  );
}
