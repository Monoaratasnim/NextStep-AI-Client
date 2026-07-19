"use client";

import React from "react";
import Link from "next/link";
import {
  Loader2,
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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useMyRoadmap, useMyRecommendation } from "@/hooks/useAi";
import Button from "@/components/shared/Button";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
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
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {getGreeting()}, {user?.fullName?.split(" ")[0] || "there"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Here&apos;s an overview of your career journey.
        </p>
      </div>

      {/* Career Profile Status */}
      {isLoading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading your career profile...
          </span>
        </div>
      ) : isNotFound ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
            <Sparkles className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No career profile yet
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
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
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          <span className="text-sm text-rose-700 dark:text-rose-300">
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                Your Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="inline-flex rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
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
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isGenerated
                ? "bg-emerald-50 dark:bg-emerald-950/30"
                : "bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <Icon
              className={`h-5 w-5 ${
                isGenerated
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isGenerated ? (
                <span className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  Generated
                  {updatedAt && (
                    <span className="inline-flex items-center gap-0.5 ml-1 text-zinc-400 dark:text-zinc-500">
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
        <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500" />
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
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
        {value}
      </p>
    </div>
  );
}
