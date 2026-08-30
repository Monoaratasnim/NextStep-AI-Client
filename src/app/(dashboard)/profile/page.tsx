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
  Shield,
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

  const profileStatus = isAdmin ? "Active" : profile ? "Completed" : "Not created";

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <section className="overflow-hidden rounded-2xl border border-[#27272A] bg-[#111111]">
        <div className="h-1 bg-gradient-to-r from-[#4F46E5] to-[#10B981]" />
        <div className="flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#10B981] text-2xl font-bold text-white ring-1 ring-white/10">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(user.fullName)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-white">
                {user.fullName}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-2.5 py-0.5 text-3xs font-medium text-[#10B981]">
                {isAdmin ? (
                  <Shield className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {isAdmin ? "Administrator" : "Member"}
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-[#A1A1AA]">
              {user.email}
            </p>
          </div>

          {isAdmin && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-1 text-xs font-medium text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              {profileStatus}
            </div>
          )}
        </div>
      </section>

      {/* Account Information */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
          Account Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard icon={User} label="Full Name" value={user.fullName} />
          <InfoCard icon={Mail} label="Email Address" value={user.email} />
          <InfoCard
            icon={Calendar}
            label="Joined"
            value={formatDate(user.createdAt)}
          />
          <InfoCard
            icon={Briefcase}
            label="Profile Status"
            value={profileStatus}
            dot={profileStatus === "Active" || profileStatus === "Completed"}
          />
        </div>
      </section>

      {/* Career Profile Summary */}
      {!isAdmin && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
            Career Profile Summary
          </h3>

          <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-5 sm:p-6">
            {profileLoading ? (
              <div className="flex items-center gap-3 py-2">
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
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-[#27272A] bg-[#18181B] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#27272A] bg-[#111111]">
                      <Target className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A]">
                        Career Goal
                      </p>
                      <p className="mt-0.5 break-words text-sm font-semibold text-white">
                        {profile.careerGoal}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-[#27272A] bg-[#18181B] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#27272A] bg-[#111111]">
                      <GraduationCap className="h-4 w-4 text-[#10B981]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A]">
                        Experience Level
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-white">
                        {profile.experienceLevel}
                      </p>
                    </div>
                  </div>
                </div>

                {profile.skills.length > 0 && (
                  <div>
                    <p className="mb-2.5 text-3xs font-medium uppercase tracking-wider text-[#71717A]">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex rounded-lg bg-[#10B981]/10 px-3 py-1 text-xs font-medium text-[#10B981]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link
                  href="/career-profile"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:text-white"
                >
                  View full career profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-[#27272A] bg-[#111111] px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10">
                  <Sparkles className="h-6 w-6 text-[#4F46E5]" />
                </div>
                <p className="mt-4 text-sm text-[#A1A1AA]">
                  No career profile yet.
                </p>
                <Link href="/career-profile" className="mt-4 inline-block">
                  <Button variant="primary" size="sm" className="gap-1.5">
                    Create Profile
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  dot,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  dot?: boolean;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-[#27272A] bg-[#111111] p-4 transition-colors hover:border-[#4F46E5]/40 hover:bg-[#18181B]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#27272A] bg-[#18181B]">
        <Icon className="h-4 w-4 text-[#A1A1AA]" />
      </div>
      <div className="min-w-0">
        <p className="text-3xs font-medium uppercase tracking-wider text-[#71717A]">
          {label}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-white">
          {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981]" />}
          <span className="break-words">{value}</span>
        </p>
      </div>
    </div>
  );
}