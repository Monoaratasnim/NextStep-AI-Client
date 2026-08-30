"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  Target,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import Button from "@/components/shared/Button";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: profile, isLoading: profileLoading, error: profileError } = useCareerProfile(
    !isAdmin
  );

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#71717A]" />
        <p className="mt-4 text-sm text-[#A1A1AA]">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          My Profile
        </h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Your account information and career overview.
        </p>
      </div>

      {/* User Info Card */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#4F46E5] text-2xl font-bold text-white">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.fullName}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>
          <div className="mt-4 sm:mt-0">
            <h3 className="text-lg font-semibold text-white">
              {user.fullName}
            </h3>
            <p className="text-sm text-[#A1A1AA]">
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow icon={User} label="Full Name" value={user.fullName} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          <InfoRow
            icon={Calendar}
            label="Joined"
            value={formatDate(user.createdAt)}
          />
          <InfoRow
            icon={Briefcase}
            label="Profile Status"
            value={profile ? "Completed" : "Not created"}
          />
        </div>
      </div>

      {/* Career Profile Summary */}
      {!isAdmin && (
        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">
            Career Profile Summary
          </h3>

          {profileLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-[#71717A]" />
              <span className="text-sm text-[#A1A1AA]">
                Loading career data...
              </span>
            </div>
          ) : profileError ? (
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span className="text-sm text-rose-300">
                {profileError.message === "Career profile not found"
                  ? "No career profile created yet."
                  : "Failed to load career profile."}
              </span>
            </div>
          ) : profile ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-[#18181B] p-3 border border-[#27272A]">
                  <Target className="h-4 w-4 text-[#71717A]" />
                  <div>
                    <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A]">
                      Career Goal
                    </p>
                    <p className="text-xs font-medium text-white">
                      {profile.careerGoal}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#18181B] p-3 border border-[#27272A]">
                  <GraduationCap className="h-4 w-4 text-[#71717A]" />
                  <div>
                    <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A]">
                      Experience Level
                    </p>
                    <p className="text-xs font-medium text-white">
                      {profile.experienceLevel}
                    </p>
                  </div>
                </div>
              </div>

              {profile.skills.length > 0 && (
                <div>
                  <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A] mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex rounded-lg bg-[#4F46E5]/10 px-2.5 py-1 text-xs font-medium text-[#4F46E5]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href="/career-profile"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#71717A] hover:text-white transition-colors"
              >
                View full career profile
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#27272A] bg-[#111111] p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5]/10">
                <Sparkles className="h-5 w-5 text-[#4F46E5]" />
              </div>
              <p className="mt-3 text-sm text-[#A1A1AA]">
                No career profile yet.
              </p>
              <Link href="/career-profile" className="mt-3 inline-block">
                <Button variant="primary" size="sm" className="gap-1.5">
                  Create Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5]/10">
        <Icon className="h-4 w-4 text-[#4F46E5]" />
      </div>
      <div>
        <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A]">
          {label}
        </p>
        <p className="text-xs font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
