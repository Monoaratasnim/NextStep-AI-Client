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
} from "lucide-react";
import { useCareerProfile } from "@/hooks/useCareerProfile";
import { useMyRoadmap, useGenerateRoadmap } from "@/hooks/useAi";
import Button from "@/components/shared/Button";

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

function handleDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function TimelinePhase({
  phase,
  index,
  isLast,
  defaultOpen,
}: {
  phase: { title: string; content: string };
  index: number;
  isLast: boolean;
  defaultOpen: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-sm font-bold text-indigo-600 dark:bg-zinc-900 dark:text-indigo-400">
          {index + 1}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700 mt-2" />
        )}
      </div>

      {/* Phase card */}
      <div className="flex-1 pb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left"
        >
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
                <Map className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {phase.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Phase {index + 1}
                </p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </div>
        </button>

        {isOpen && (
          <div className="mt-2 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-headings:text-xs prose-headings:font-semibold prose-headings:uppercase prose-headings:tracking-wider prose-headings:text-zinc-500 dark:prose-headings:text-zinc-400 prose-p:text-sm prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-li:text-sm prose-li:text-zinc-600 dark:prose-li:text-zinc-400 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50 prose-code:text-xs prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-700 dark:prose-code:text-zinc-300">
              <Markdown>{phase.content}</Markdown>
            </div>
          </div>
        )}
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

  const roadmap = generatedRoadmap || savedRoadmap;
  const roadmapContent = roadmap?.content;
  const isProfileNotFound =
    profileError?.message === "Career profile not found";

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
    handleDownload(roadmapContent, "career-roadmap.md");
  }, [roadmapContent]);

  if (profileLoading || savedLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"
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
          Create your career profile first to generate a personalized
          learning roadmap.
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
            Career Roadmap
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            AI-generated step-by-step learning path for your career goal.
          </p>
          {roadmap?.updatedAt && (
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Generated on{" "}
              {new Date(roadmap.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {roadmapContent && (
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
          {!roadmapContent && (
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
                  Generating...
                </>
              ) : (
                <>
                  <Map className="h-4 w-4" />
                  Generate Roadmap
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
            Target Goal
          </h3>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {profile.careerGoal}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {profile.experienceLevel}
          </div>
        </div>
      )}

      {/* Error state */}
      {roadmapError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/30 dark:bg-rose-950/20">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
              Generation failed
            </p>
            <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
              {roadmapError.message}
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isPending && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3 mb-5">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              AI is crafting your roadmap...
            </span>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 sm:gap-6"
              >
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="flex-1 h-20 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
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
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}

      {/* Fallback - full markdown */}
      {roadmapContent && phases.length === 0 && !isPending && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <Markdown>{roadmapContent}</Markdown>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!roadmapContent && !isPending && !roadmapError && (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <Map className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            Click &ldquo;Generate Roadmap&rdquo; to get your personalized
            learning path.
          </p>
        </div>
      )}
    </div>
  );
}
