"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Map,
  Copy,
  RefreshCw,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Route,
  Target,
  Zap,
  CheckCircle2,
  Clock,
  Trophy,
  Rocket,
} from "lucide-react";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useMyRoadmap, useGenerateRoadmap } from "@/hooks/useAi";
import { useNotifications } from "@/contexts/NotificationContext";
import Button from "@/components/shared/Button";
import { generatePdf } from "@/utils/generatePdf";

function parsePhases(content: string) {
  const phases: { title: string; content: string }[] = [];
  const parts = content.split(/^## /m);

  if (parts[0]?.trim() && !parts[0].trim().startsWith("#")) {
    phases.push({ title: "Overview", content: parts[0].trim() });
  }

  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split("\n");
    const title = lines[0]
      .replace(/^#+\s*/, "")
      .replace(/^\d+[\.\)]\s*/, "")
      .trim();
    const body = lines.slice(1).join("\n").trim();
    if (title) phases.push({ title, content: body });
  }

  return phases;
}

function getPhaseStyle(index: number, total: number) {
  if (index === 0) {
    return {
      node: "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-emerald-500/20",
      line: "from-emerald-500/40",
      card: "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-emerald-500/5",
      badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/10",
      icon: Rocket,
      label: "Start",
    };
  }
  if (index === total - 1) {
    return {
      node: "border-amber-500 bg-amber-500/15 text-amber-400 shadow-amber-500/20",
      line: "from-amber-500/40",
      card: "border-amber-500/30 hover:border-amber-500/50 hover:shadow-amber-500/5",
      badge: "bg-amber-500/10 text-amber-400 ring-amber-500/10",
      icon: Trophy,
      label: "Goal",
    };
  }
  return {
    node: "border-[#4F46E5] bg-[#4F46E5]/15 text-[#4F46E5] shadow-[#4F46E5]/20",
    line: "from-[#4F46E5]/40",
    card: "border-[#4F46E5]/20 hover:border-[#4F46E5]/40 hover:shadow-[#4F46E5]/5",
    badge: "bg-[#4F46E5]/10 text-[#4F46E5] ring-[#4F46E5]/10",
    icon: Route,
    label: `Phase ${index}`,
  };
}

function TimelinePhase({
  phase,
  index,
  isLast,
  total,
  defaultOpen,
}: {
  phase: { title: string; content: string };
  index: number;
  isLast: boolean;
  total: number;
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const style = getPhaseStyle(index, total);
  const PhaseIcon = style.icon;

  return (
    <div className="relative flex gap-4 sm:gap-6 group/timeline">
      {/* Timeline line + node */}
      <div className="flex flex-col items-center">
        {/* Node */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 group-hover/timeline:scale-110 ${style.node}`}
        >
          {index === 0 ? (
            <Rocket className="h-4.5 w-4.5" />
          ) : isLast ? (
            <Trophy className="h-4.5 w-4.5" />
          ) : (
            <span className="text-xs font-bold">{index + 1}</span>
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className="relative w-0.5 flex-1 my-2">
            <div className="absolute inset-0 bg-[#27272A]" />
            <div
              className={`absolute inset-0 bg-gradient-to-b ${style.line} to-transparent`}
            />
          </div>
        )}
      </div>

      {/* Phase card */}
      <div className="flex-1 pb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left group/card"
        >
          <div
            className={`flex items-center justify-between rounded-2xl border bg-[#0F0F11] p-4 transition-all duration-300 ${style.card} ${
              isOpen ? "shadow-lg" : "shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover/card:scale-110 ${style.badge} ring-1`}>
                <PhaseIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">
                  {phase.title}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${style.badge} ring-1`}>
                    {style.label}
                  </span>
                  {!isOpen && (
                    <span className="text-[10px] text-[#71717A]">
                      Click to expand
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-[#71717A] transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-[#71717A] transition-transform duration-200" />
              )}
            </div>
          </div>
        </button>

        {/* Expandable content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] p-5 sm:p-6">
            <div className="prose prose-sm max-w-none
              prose-headings:text-xs prose-headings:font-semibold prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-[#71717A] prose-headings:mt-5 prose-headings:mb-2
              prose-p:text-sm prose-p:text-[#A1A1AA] prose-p:leading-relaxed
              prose-li:text-sm prose-li:text-[#A1A1AA] prose-li:marker:text-[#3F3F46]
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-xs prose-code:bg-[#27272A]/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#A1A1AA] prose-code:font-medium
              prose-a:text-[#4F46E5] prose-a:no-underline hover:prose-a:underline
              prose-hr:border-[#27272A] prose-hr:my-4
              prose-blockquote:border-l-[#4F46E5] prose-blockquote:text-[#71717A] prose-blockquote:pl-4 prose-blockquote:italic
            ">
              <Markdown>{phase.content}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useCareerProfile();

  const { data: savedRoadmap, isLoading: savedLoading } = useMyRoadmap();

  const {
    mutate: generateRoadmap,
    data: generatedRoadmap,
    isPending,
    error: roadmapError,
    reset,
  } = useGenerateRoadmap();

  const { addNotification } = useNotifications();

  const roadmap = generatedRoadmap || savedRoadmap;
  const roadmapContent = roadmap?.content;
  const isProfileNotFound =
    profileError?.message === "Career profile not found";

  React.useEffect(() => {
    if (generatedRoadmap) {
      addNotification({
        type: "roadmap",
        title: "Roadmap Generated",
        description: "Your AI career roadmap has been successfully generated.",
      });
    }
  }, [generatedRoadmap, addNotification]);

  const phases = useMemo(
    () => (roadmapContent ? parsePhases(roadmapContent) : []),
    [roadmapContent]
  );

  const handleGenerate = useCallback(() => {
    if (!profile) return;
    generateRoadmap({
      careerGoal: profile.careerGoal,
      skills: profile.skills,
      experienceLevel: profile.experienceLevel,
    });
  }, [profile, generateRoadmap]);

  const handleCopy = useCallback(() => {
    if (!roadmapContent) return;
    navigator.clipboard.writeText(roadmapContent);
    toast.success("Roadmap copied to clipboard!");
  }, [roadmapContent]);

  const handleRegenerate = useCallback(() => {
    reset();
    handleGenerate();
  }, [reset, handleGenerate]);

  const handleDownloadClick = useCallback(() => {
    if (!roadmapContent) return;
    generatePdf(roadmapContent, "career-roadmap.pdf", {
      title: "Career Roadmap",
      careerGoal: profile?.careerGoal,
      preferredIndustry: profile?.preferredIndustry,
      experienceLevel: profile?.experienceLevel,
      generatedAt: roadmap?.updatedAt
        ? new Date(roadmap.updatedAt)
        : undefined,
    });
  }, [roadmapContent, profile, roadmap]);

  if (profileLoading || savedLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-[#27272A]/50" />
            <div className="h-8 w-56 animate-pulse rounded-lg bg-[#27272A]/50" />
          </div>
          <div className="h-4 w-80 animate-pulse rounded-lg bg-[#27272A]/30" />
        </div>
        {/* Skeleton toolbar */}
        <div className="h-12 w-full animate-pulse rounded-xl bg-[#27272A]/30" />
        {/* Skeleton profile */}
        <div className="h-28 w-full animate-pulse rounded-2xl bg-[#27272A]/30" />
        {/* Skeleton timeline */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#27272A]/50" />
              <div className="flex-1 h-24 animate-pulse rounded-2xl bg-[#27272A]/30" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (profileError && !isProfileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20">
          <AlertCircle className="h-8 w-8 text-rose-400" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">
          Something went wrong
        </h3>
        <p className="mt-2 max-w-sm text-sm text-[#A1A1AA] leading-relaxed">
          {profileError.message}
        </p>
      </div>
    );
  }

  if (isProfileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[#4F46E5]/10 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5]/20 to-[#4F46E5]/5 ring-1 ring-[#4F46E5]/20">
            <Sparkles className="h-9 w-9 text-[#4F46E5]" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-white">
          Career profile required
        </h3>
        <p className="mt-2 max-w-md text-sm text-[#A1A1AA] leading-relaxed">
          Create your career profile first to generate a personalized
          learning roadmap tailored to your goals.
        </p>
        <Link href="/career-profile" className="mt-6 inline-block">
          <Button variant="primary" size="md" className="gap-2 px-6">
            Create Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#27272A]/60 bg-gradient-to-br from-[#0F0F11] via-[#111113] to-[#0F0F11] p-5 sm:p-6">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#10B981]/8 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-[#4F46E5]/5 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-emerald-600 shadow-lg shadow-[#10B981]/20">
              <Map className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Career Roadmap
              </h2>
              <p className="mt-1.5 text-sm text-[#A1A1AA] leading-relaxed">
                AI-generated step-by-step learning path for your career goal.
              </p>
              {roadmap?.updatedAt && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#27272A] bg-[#111113] px-3 py-1">
                  <Zap className="h-3 w-3 text-[#10B981]" />
                  <span className="text-xs text-[#71717A]">
                    Generated{" "}
                    {new Date(roadmap.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {roadmapContent && (
        <div className="rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
              <span className="hidden sm:inline">AI Roadmap Report</span>
              <span className="sm:hidden">Report</span>
              <span className="mx-1.5 text-[#3F3F46]">·</span>
              <Clock className="h-3 w-3 text-[#71717A]" />
              <span>{phases.length} phases</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-[#A1A1AA] hover:text-white"
              >
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadClick}
                className="gap-1.5 text-[#A1A1AA] hover:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </Button>
              <div className="h-4 w-px bg-[#27272A]" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isPending}
                className="gap-1.5 text-[#A1A1AA] hover:text-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Regenerate</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Summary */}
      {profile && (
        <div className="rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-[#10B981]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
              Target Goal
            </h3>
          </div>
          <p className="text-base font-semibold text-white leading-snug">
            {profile.careerGoal}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="inline-flex rounded-lg bg-[#4F46E5]/10 px-2.5 py-1 text-xs font-medium text-[#4F46E5] ring-1 ring-[#4F46E5]/10 transition-colors hover:bg-[#4F46E5]/15"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 6 && (
              <span className="inline-flex rounded-lg bg-[#27272A]/40 px-2.5 py-1 text-xs font-medium text-[#71717A]">
                +{profile.skills.length - 6} more
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#A1A1AA]">
            <div className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
            <span>{profile.experienceLevel}</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {roadmapError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 ring-1 ring-rose-500/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-rose-300">
              Generation failed
            </p>
            <p className="mt-0.5 text-xs text-rose-400/70">
              {roadmapError.message}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isPending && (
        <div className="overflow-hidden rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#10B981]/20 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/15">
                <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                AI is crafting your roadmap
              </p>
              <p className="text-xs text-[#71717A]">
                Building a personalized step-by-step plan...
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#27272A]/50" />
                  {i < 3 && <div className="w-0.5 flex-1 animate-pulse bg-[#27272A]/30 mt-2" />}
                </div>
                <div className="flex-1 h-20 animate-pulse rounded-2xl bg-[#27272A]/30" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {phases.length > 0 && !isPending && (
        <div className="flex items-center gap-2 rounded-xl border border-[#27272A]/60 bg-[#0F0F11] px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
          <span className="text-xs font-medium text-[#A1A1AA]">
            {phases.length} phases
          </span>
          <span className="text-[#3F3F46]">·</span>
          <span className="text-xs text-[#71717A]">
            Click any phase to expand details
          </span>
        </div>
      )}

      {/* Timeline */}
      {phases.length > 0 && !isPending && (
        <div className="pl-0">
          {phases.map((phase, i) => (
            <TimelinePhase
              key={`${phase.title}-${i}`}
              phase={phase}
              index={i}
              isLast={i === phases.length - 1}
              total={phases.length}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}

      {/* Fallback - full markdown */}
      {roadmapContent && phases.length === 0 && !isPending && (
        <div className="overflow-hidden rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] p-6 sm:p-8">
          <div className="prose prose-sm max-w-none
            prose-headings:text-white prose-headings:font-semibold
            prose-p:text-[#A1A1AA] prose-p:leading-relaxed
            prose-li:text-[#A1A1AA]
            prose-strong:text-white
            prose-code:text-xs prose-code:bg-[#27272A]/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#A1A1AA]
          ">
            <Markdown>{roadmapContent}</Markdown>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!roadmapContent && !isPending && !roadmapError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-6 rounded-full bg-[#10B981]/8 blur-2xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#27272A]/60 bg-[#111113]">
              <Map className="h-7 w-7 text-[#71717A]" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Ready to map your journey
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[#71717A] leading-relaxed">
            Click &ldquo;Generate Roadmap&rdquo; to get your personalized
            learning path powered by AI.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerate}
            disabled={isPending}
            className="mt-6 gap-2 px-6"
          >
            <Map className="h-4 w-4" />
            Generate Roadmap
          </Button>
        </div>
      )}
    </div>
  );
}
