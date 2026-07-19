"use client";

import { Briefcase, Building2, Map, Bot } from "lucide-react";
import { usePublicStats } from "@/hooks/usePublicHome";
import { SkeletonBlock } from "@/components/shared/Loading";

export default function Statistics() {
  const { data: stats, isLoading } = usePublicStats();

  const statItems = [
    {
      icon: Briefcase,
      label: "Career Paths",
      value: stats?.totalCareers ?? 0,
    },
    {
      icon: Building2,
      label: "Industries Covered",
      value: stats?.totalIndustries ?? 0,
    },
    {
      icon: Map,
      label: "AI Roadmaps Generated",
      value: stats?.totalRoadmaps ?? 0,
    },
    {
      icon: Bot,
      label: "AI Recommendations",
      value: stats?.totalRecommendations ?? 0,
    },
  ];

  return (
    <section className="bg-[#000000] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full border border-[#27272A] bg-[#111111] px-4 py-1.5 text-xs font-medium tracking-wide text-[#A1A1AA]">
            📊 Platform Statistics
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Empowering Career Growth with AI
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#A1A1AA]">
            Discover how NextStep AI is helping learners and professionals
            explore career paths, receive AI-powered recommendations, and build
            personalized learning roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 text-center"
            >
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <SkeletonBlock className="h-12 w-12 rounded-xl" />
                  <SkeletonBlock className="h-8 w-20 rounded-lg" />
                  <SkeletonBlock className="h-4 w-24 rounded-lg" />
                </div>
              ) : (
                <>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-[#A1A1AA]">
                    {stat.label}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
