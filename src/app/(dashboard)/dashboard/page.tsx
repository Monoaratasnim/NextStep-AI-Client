"use client";

import React from "react";
import Link from "next/link";
import {
  Target,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Map,
  Lightbulb,
  Check,
  Clock,
  Users,
  PlusCircle,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useMyRoadmap, useMyRecommendation } from "@/hooks/useAi";
import { useAdminStats } from "@/hooks/useAdminStats";
import Button from "@/components/shared/Button";
import { DashboardSkeleton } from "@/components/shared/Loading";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}

/* ------------------------------------------------------------------ */
/*  Admin Dashboard                                                    */
/* ------------------------------------------------------------------ */

function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats();

  const statsCards = [
    {
      icon: Users,
      label: "Total Users",
      value: isLoading ? "..." : stats?.totalUsers ?? 0,
    },
    {
      icon: Briefcase,
      label: "Total Careers",
      value: isLoading ? "..." : stats?.totalCareers ?? 0,
    },
    {
      icon: Star,
      label: "Average Rating",
      value: isLoading ? "..." : `${stats?.averageRating?.toFixed(1) ?? "0.0"} ⭐`,
    },
    {
      icon: Building2,
      label: "Total Industries",
      value: isLoading ? "..." : stats?.totalIndustries ?? 0,
    },
  ];

  const actions = [
    {
      icon: PlusCircle,
      title: "Add Career",
      description: "Create a new career profile in the library.",
      href: "/dashboard/add-career",
    },
    {
      icon: Users,
      title: "Manage Careers",
      description: "View, edit, and manage all career profiles.",
      href: "/dashboard/manage-careers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Welcome back, Admin
        </h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Manage the Career Library and monitor platform activity from one
          place.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4">
          <p className="text-sm text-rose-300">
            Failed to load statistics. Please try again later.
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#27272A] bg-[#111111] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10">
                <stat.icon className="h-4.5 w-4.5 text-[#4F46E5]" />
              </div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
                {stat.label}
              </span>
            </div>
            <p className="text-lg font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717A]">
          Quick Actions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="group">
              <div className="flex items-start justify-between rounded-2xl border border-[#27272A] bg-[#111111] p-5 transition-all duration-200 hover:border-[#4F46E5]/50 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4F46E5]/10">
                    <action.icon className="h-5 w-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {action.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#A1A1AA]">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#71717A] transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  User Dashboard (unchanged)                                         */
/* ------------------------------------------------------------------ */

function UserDashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useCareerProfile();
  const { data: savedRoadmap } = useMyRoadmap();
  const { data: savedRecommendation } = useMyRecommendation();

  const isNotFound = error?.message === "Career profile not found";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {getGreeting()}, {user?.fullName?.split(" ")[0] || "there"}
        </h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Here&apos;s an overview of your career journey.
        </p>
      </div>

      {/* Career Profile Status */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isNotFound ? (
        <div className="rounded-2xl border border-dashed border-[#27272A] bg-[#111111] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5]/10">
            <Sparkles className="h-7 w-7 text-[#4F46E5]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white">
            No career profile yet
          </h3>
          <p className="mt-1 text-sm text-[#A1A1AA] max-w-md mx-auto">
            Create your career profile to get personalized AI
            recommendations and a tailored skill roadmap.
          </p>
          <Link href="/career-profile" className="mt-5 inline-block">
            <Button variant="primary" size="md" className="gap-1.5">
              Create Your Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-950/20 p-6">
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <span className="text-sm text-rose-300">
            {error.message}
          </span>
        </div>
      ) : profile ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardStat
              icon={Target}
              label="Career Goal"
              value={profile.careerGoal}
            />
            <DashboardStat
              icon={Briefcase}
              label="Current Role"
              value={profile.currentRole || "Not specified"}
            />
            <DashboardStat
              icon={GraduationCap}
              label="Experience"
              value={profile.experienceLevel}
            />
          </div>

          {/* Skills preview */}
          {profile.skills.length > 0 && (
            <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Your Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex rounded-lg bg-[#4F46E5]/10 px-3 py-1.5 text-xs font-medium text-[#4F46E5]"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="inline-flex rounded-lg bg-[#27272A]/50 px-3 py-1.5 text-xs font-medium text-[#71717A]">
                    +{profile.skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI Status Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <AiStatusCard
              icon={Map}
              title="Career Roadmap"
              description="AI-generated learning path"
              isGenerated={!!savedRoadmap}
              updatedAt={savedRoadmap?.updatedAt}
              href="/roadmap"
            />
            <AiStatusCard
              icon={Lightbulb}
              title="Recommendations"
              description="Personalized career advice"
              isGenerated={!!savedRecommendation}
              updatedAt={savedRecommendation?.updatedAt}
              href="/recommendation"
            />
          </div>

          <Link
            href="/career-profile"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#71717A] hover:text-white transition-colors"
          >
            View full profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function AiStatusCard({
  icon: Icon,
  title,
  description,
  isGenerated,
  updatedAt,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  isGenerated: boolean;
  updatedAt?: string;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="flex items-center justify-between rounded-2xl border border-[#27272A] bg-[#111111] p-5 transition-all duration-200 hover:border-[#4F46E5]/50 hover:shadow-md">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isGenerated
                ? "bg-[#10B981]/10"
                : "bg-[#27272A]/50"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                isGenerated
                  ? "text-[#10B981]"
                  : "text-[#71717A]"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {title}
            </p>
            <p className="text-xs text-[#A1A1AA]">
              {isGenerated ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3 text-[#10B981]" />
                  Generated
                  {updatedAt && (
                    <span className="inline-flex items-center gap-0.5 ml-1 text-[#71717A]">
                      <Clock className="h-2.5 w-2.5" />
                      {formatDate(updatedAt)}
                    </span>
                  )}
                </span>
              ) : (
                description
              )}
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-[#71717A] transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function DashboardStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[#4F46E5]" />
        <span className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-white truncate">
        {value}
      </p>
    </div>
  );
}
