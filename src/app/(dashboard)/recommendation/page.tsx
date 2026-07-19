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
} from "lucide-react";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useMyRecommendation, useGenerateRecommendation } from "@/hooks/useAi";
import Button from "@/components/shared/Button";

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
    return { icon: Briefcase, border: "border-l-indigo-500" };
  if (lower.includes("missing skill"))
    return { icon: AlertTriangle, border: "border-l-amber-500" };
  if (lower.includes("technolog"))
    return { icon: Cpu, border: "border-l-blue-500" };
  if (lower.includes("project"))
    return { icon: FolderGit2, border: "border-l-emerald-500" };
  if (lower.includes("certification"))
    return { icon: Award, border: "border-l-purple-500" };
  if (lower.includes("job role"))
    return { icon: UserCheck, border: "border-l-cyan-500" };
  if (lower.includes("salary"))
    return { icon: DollarSign, border: "border-l-green-500" };
  if (lower.includes("resource") || lower.includes("learning"))
    return { icon: BookOpen, border: "border-l-orange-500" };
  if (lower.includes("advice") || lower.includes("final"))
    return { icon: Lightbulb, border: "border-l-yellow-500" };

  return { icon: FileText, border: "border-l-zinc-400" };
}

function handleDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function SectionCard({ title, content }: { title: string; content: string }) {
  const { icon: Icon, border } = getSectionStyle(title);

  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 border-l-4 ${border}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
      </div>
      <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-headings:text-xs prose-headings:font-semibold prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-zinc-500 dark:prose-headings:text-zinc-400 prose-p:text-sm prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-li:text-sm prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50 prose-code:text-xs prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-700 dark:prose-code:text-zinc-300">
        <Markdown>{content}</Markdown>
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

  const recommendation = generatedRecommendation || savedRecommendation;
  const recommendationContent = recommendation?.content;
  const isProfileNotFound =
    profileError?.message === "Career profile not found";

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
    handleDownload(recommendationContent, "career-recommendation.md");
  }, [recommendationContent]);

  if (profileLoading || savedLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (profileError && !isProfileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/30">
          <AlertCircle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Something went wrong
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {profileError.message}
        </p>
      </div>
    );
  }

  if (isProfileNotFound) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <Sparkles className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Career profile required
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          Create your career profile first to get personalized AI career
          recommendations.
        </p>
        <Link href="/career-profile" className="mt-5 inline-block">
          <Button variant="primary" size="md" className="gap-1.5">
            Create Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Career Recommendations
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            AI-powered analysis of your skills, interests, and career path.
          </p>
          {recommendation?.updatedAt && (
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Generated on{" "}
              {new Date(recommendation.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {recommendationContent && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadClick}
                className="gap-1.5"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isPending}
                className="gap-1.5"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </>
          )}
          {!recommendationContent && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerate}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4" />
                  Get Recommendations
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      {profile && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
            Your Profile
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
              >
                {skill}
              </span>
            ))}
            {profile.skills.length > 6 && (
              <span className="inline-flex rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                +{profile.skills.length - 6} more
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{profile.experienceLevel}</span>
            {profile.education && <span>{profile.education}</span>}
          </div>
        </div>
      )}

      {/* Error state */}
      {recError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
              Generation failed
            </p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
              {recError.message}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isPending && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-5">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              AI is analyzing your profile...
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50"
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
            />
          ))}
        </div>
      )}

      {/* Fallback - full markdown if no sections parsed */}
      {recommendationContent &&
        sections.length === 0 &&
        !isPending && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <Markdown>{recommendationContent}</Markdown>
            </div>
          </div>
        )}

      {/* Empty state */}
      {!recommendationContent && !isPending && !recError && (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <Lightbulb className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Click &ldquo;Get Recommendations&rdquo; to receive personalized
            career advice.
          </p>
        </div>
      )}
    </div>
  );
}
