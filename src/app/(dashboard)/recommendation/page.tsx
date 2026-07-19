"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Lightbulb,
  Copy,
  RefreshCw,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Download,
  Briefcase,
  AlertTriangle,
  Cpu,
  FolderGit2,
  Award,
  UserCheck,
  DollarSign,
  BookOpen,
  FileText,
  Zap,
  Target,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useMyRecommendation, useGenerateRecommendation } from "@/hooks/useAi";
import { useNotifications } from "@/contexts/NotificationContext";
import Button from "@/components/shared/Button";
import { generatePdf } from "@/utils/generatePdf";

function parseSections(content: string) {
  const sections: { title: string; content: string }[] = [];
  const parts = content.split(/^## /m);

  if (parts[0]?.trim() && !parts[0].trim().startsWith("#")) {
    sections.push({ title: "", content: parts[0].trim() });
  }

  for (let i = 1; i < parts.length; i++) {
    const lines = parts[i].split("\n");
    const title = lines[0]
      .replace(/^#+\s*/, "")
      .replace(/^\d+\.\s*/, "")
      .trim();
    const body = lines.slice(1).join("\n").trim();
    if (title) sections.push({ title, content: body });
  }

  return sections;
}

function getSectionStyle(title: string) {
  const lower = title.toLowerCase();

  if (lower.includes("career path") || lower.includes("best career"))
    return {
      icon: Briefcase,
      gradient: "from-[#4F46E5]/20 to-[#4F46E5]/5",
      iconBg: "bg-[#4F46E5]/15",
      iconColor: "text-[#4F46E5]",
      borderColor: "border-l-[#4F46E5]",
      glow: "hover:shadow-[#4F46E5]/10",
    };
  if (lower.includes("missing skill") || lower.includes("skill gap"))
    return {
      icon: AlertTriangle,
      gradient: "from-amber-500/20 to-amber-500/5",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      borderColor: "border-l-amber-500",
      glow: "hover:shadow-amber-500/10",
    };
  if (lower.includes("technolog"))
    return {
      icon: Cpu,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      borderColor: "border-l-blue-500",
      glow: "hover:shadow-blue-500/10",
    };
  if (lower.includes("project"))
    return {
      icon: FolderGit2,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      borderColor: "border-l-emerald-500",
      glow: "hover:shadow-emerald-500/10",
    };
  if (lower.includes("certification"))
    return {
      icon: Award,
      gradient: "from-purple-500/20 to-purple-500/5",
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-400",
      borderColor: "border-l-purple-500",
      glow: "hover:shadow-purple-500/10",
    };
  if (lower.includes("job role") || lower.includes("role"))
    return {
      icon: UserCheck,
      gradient: "from-cyan-500/20 to-cyan-500/5",
      iconBg: "bg-cyan-500/15",
      iconColor: "text-cyan-400",
      borderColor: "border-l-cyan-500",
      glow: "hover:shadow-cyan-500/10",
    };
  if (lower.includes("salary") || lower.includes("compensation"))
    return {
      icon: DollarSign,
      gradient: "from-green-500/20 to-green-500/5",
      iconBg: "bg-green-500/15",
      iconColor: "text-green-400",
      borderColor: "border-l-green-500",
      glow: "hover:shadow-green-500/10",
    };
  if (lower.includes("resource") || lower.includes("learning"))
    return {
      icon: BookOpen,
      gradient: "from-orange-500/20 to-orange-500/5",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-400",
      borderColor: "border-l-orange-500",
      glow: "hover:shadow-orange-500/10",
    };
  if (lower.includes("advice") || lower.includes("final") || lower.includes("recommendation"))
    return {
      icon: Lightbulb,
      gradient: "from-yellow-500/20 to-yellow-500/5",
      iconBg: "bg-yellow-500/15",
      iconColor: "text-yellow-400",
      borderColor: "border-l-yellow-500",
      glow: "hover:shadow-yellow-500/10",
    };
  if (lower.includes("industry"))
    return {
      icon: TrendingUp,
      gradient: "from-pink-500/20 to-pink-500/5",
      iconBg: "bg-pink-500/15",
      iconColor: "text-pink-400",
      borderColor: "border-l-pink-500",
      glow: "hover:shadow-pink-500/10",
    };

  return {
    icon: FileText,
    gradient: "from-[#71717A]/20 to-[#71717A]/5",
    iconBg: "bg-[#71717A]/15",
    iconColor: "text-[#A1A1AA]",
    borderColor: "border-l-[#71717A]",
    glow: "hover:shadow-[#71717A]/10",
  };
}

function SectionCard({ title, content, index }: { title: string; content: string; index: number }) {
  const style = getSectionStyle(title);
  const Icon = style.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[#27272A]/80 bg-[#0F0F11] p-6 border-l-4 ${style.borderColor} transition-all duration-300 hover:border-[#3F3F46] hover:shadow-lg ${style.glow} hover:-translate-y-0.5`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="relative">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`h-5 w-5 ${style.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white tracking-tight">
              {title}
            </h3>
          </div>
          <ChevronRight className="h-4 w-4 text-[#3F3F46] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
        </div>

        {/* Section content */}
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
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </div>
  );
}

export default function RecommendationPage() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useCareerProfile();

  const { data: savedRecommendation, isLoading: savedLoading } =
    useMyRecommendation();

  const {
    mutate: generateRecommendation,
    data: generatedRecommendation,
    isPending,
    error: recError,
    reset,
  } = useGenerateRecommendation();

  const { addNotification } = useNotifications();

  const recommendation = generatedRecommendation || savedRecommendation;
  const recommendationContent = recommendation?.content;
  const isProfileNotFound =
    profileError?.message === "Career profile not found";

  React.useEffect(() => {
    if (generatedRecommendation) {
      addNotification({
        type: "recommendation",
        title: "Recommendation Ready",
        description:
          "Your AI career recommendations have been successfully generated.",
      });
    }
  }, [generatedRecommendation, addNotification]);

  const sections = useMemo(
    () =>
      recommendationContent ? parseSections(recommendationContent) : [],
    [recommendationContent]
  );

  const handleGenerate = useCallback(() => {
    if (!profile) return;
    generateRecommendation({
      skills: profile.skills,
      interests: profile.interests,
      experienceLevel: profile.experienceLevel,
      education: profile.education,
    });
  }, [profile, generateRecommendation]);

  const handleCopy = useCallback(() => {
    if (!recommendationContent) return;
    navigator.clipboard.writeText(recommendationContent);
    toast.success("Recommendation copied to clipboard!");
  }, [recommendationContent]);

  const handleRegenerate = useCallback(() => {
    reset();
    handleGenerate();
  }, [reset, handleGenerate]);

  const handleDownloadClick = useCallback(() => {
    if (!recommendationContent) return;
    generatePdf(recommendationContent, "career-recommendation.pdf", {
      title: "Career Recommendation",
      careerGoal: profile?.careerGoal,
      preferredIndustry: profile?.preferredIndustry,
      experienceLevel: profile?.experienceLevel,
      generatedAt: recommendation?.updatedAt
        ? new Date(recommendation.updatedAt)
        : undefined,
    });
  }, [recommendationContent, profile, recommendation]);

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
        {/* Skeleton cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl border border-[#27272A]/30 bg-[#111111]/50"
              style={{ animationDelay: `${i * 80}ms` }}
            />
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
          Create your career profile first to get personalized AI career
          recommendations tailored to your skills and goals.
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
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#4F46E5]/8 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-[#4F46E5]/5 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] shadow-lg shadow-[#4F46E5]/20">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Career Recommendations
              </h2>
              <p className="mt-1.5 text-sm text-[#A1A1AA] leading-relaxed">
                AI-powered analysis of your skills, interests, and career path.
              </p>
              {recommendation?.updatedAt && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#27272A] bg-[#111113] px-3 py-1">
                  <Zap className="h-3 w-3 text-[#4F46E5]" />
                  <span className="text-xs text-[#71717A]">
                    Generated{" "}
                    {new Date(recommendation.updatedAt).toLocaleDateString("en-US", {
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
      {recommendationContent && (
        <div className="rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
              <span className="hidden sm:inline">AI Recommendation Report</span>
              <span className="sm:hidden">Report</span>
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
            <Target className="h-4 w-4 text-[#4F46E5]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
              Your Profile
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Skills */}
            <div className="sm:col-span-2">
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex rounded-lg bg-[#4F46E5]/10 px-2.5 py-1 text-xs font-medium text-[#4F46E5] ring-1 ring-[#4F46E5]/10 transition-colors hover:bg-[#4F46E5]/15"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="inline-flex rounded-lg bg-[#27272A]/40 px-2.5 py-1 text-xs font-medium text-[#71717A]">
                    +{profile.skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
            {/* Meta */}
            <div className="flex flex-col gap-2 text-xs text-[#A1A1AA]">
              {profile.experienceLevel && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#4F46E5]" />
                  <span>{profile.experienceLevel}</span>
                </div>
              )}
              {profile.education && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span>{profile.education}</span>
                </div>
              )}
              {profile.interests && profile.interests.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>{profile.interests.slice(0, 3).join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {recError && (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 ring-1 ring-rose-500/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-rose-300">
              Generation failed
            </p>
            <p className="mt-0.5 text-xs text-rose-400/70">
              {recError.message}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isPending && (
        <div className="overflow-hidden rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#4F46E5]/20 blur-md" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5]/15">
                <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                AI is analyzing your profile
              </p>
              <p className="text-xs text-[#71717A]">
                This may take a few moments...
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl border border-[#27272A]/30 bg-[#111113]/60"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result - Structured Sections */}
      {sections.length > 0 && !isPending && (
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section, i) => (
            <SectionCard
              key={`${section.title}-${i}`}
              title={section.title}
              content={section.content}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Fallback - full markdown if no sections parsed */}
      {recommendationContent &&
        sections.length === 0 &&
        !isPending && (
          <div className="overflow-hidden rounded-2xl border border-[#27272A]/60 bg-[#0F0F11] p-6 sm:p-8">
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-p:text-[#A1A1AA] prose-p:leading-relaxed
              prose-li:text-[#A1A1AA]
              prose-strong:text-white
              prose-code:text-xs prose-code:bg-[#27272A]/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[#A1A1AA]
            ">
              <Markdown>{recommendationContent}</Markdown>
            </div>
          </div>
        )}

      {/* Empty state */}
      {!recommendationContent && !isPending && !recError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-6 rounded-full bg-[#4F46E5]/8 blur-2xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-[#27272A]/60 bg-[#111113]">
              <Lightbulb className="h-7 w-7 text-[#71717A]" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white">
            Ready to explore your career path
          </h3>
          <p className="mt-2 max-w-sm text-sm text-[#71717A] leading-relaxed">
            Click &ldquo;Get Recommendations&rdquo; to receive personalized
            career advice powered by AI.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerate}
            disabled={isPending}
            className="mt-6 gap-2 px-6"
          >
            <Lightbulb className="h-4 w-4" />
            Get Recommendations
          </Button>
        </div>
      )}

      {/* Generate button when no content (alternative placement) */}
      {!recommendationContent && !isPending && !recError && (
        <div />
      )}

      {/* Fallback generate button */}
      {!recommendationContent && !isPending && !recError && profile && (
        <div className="hidden" />
      )}
    </div>
  );
}
