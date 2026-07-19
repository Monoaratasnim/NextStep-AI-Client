"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Briefcase,
  CheckCircle,
  Target,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Globe,
  MapPin,
} from "lucide-react";
import { useCareer, usePublicCareers } from "@/hooks/useCareerLibrary";
import { useAuth } from "@/hooks/useAuth";
import { SkeletonBlock, ErrorState } from "@/components/shared/Loading";
import Button from "@/components/shared/Button";

export default function CareerDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const { data: career, isLoading, error } = useCareer(id);

  const { data: relatedData } = usePublicCareers({
    industry: career?.industry,
    limit: 4,
    sort: "-rating",
  });

  const relatedCareers =
    relatedData?.careers.filter((c) => c._id !== id).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SkeletonBlock className="mb-6 h-8 w-32 rounded-lg" />
        <SkeletonBlock className="mb-8 h-[240px] sm:h-[300px] lg:h-[380px] w-full rounded-2xl" />
        <SkeletonBlock className="mb-4 h-6 w-24 rounded-full" />
        <SkeletonBlock className="mb-3 h-8 w-3/4 rounded-lg" />
        <SkeletonBlock className="mb-10 h-5 w-full rounded-lg" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonBlock className="h-48 rounded-2xl" />
            <SkeletonBlock className="h-32 rounded-2xl" />
            <SkeletonBlock className="h-40 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <SkeletonBlock className="h-64 rounded-2xl" />
            <SkeletonBlock className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message={error?.message || "Career not found."} />
        <div className="mt-6 text-center">
          <Link href="/careers">
            <Button variant="outline" size="md" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Careers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/careers"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#71717A] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Careers
      </Link>

      {/* Hero Image */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-[#27272A] shadow-lg shadow-black/20">
        <div className="relative h-[240px] sm:h-[300px] lg:h-[380px] w-full bg-[#18181B]">
          {career.image ? (
            <Image
              src={career.image}
              alt={career.title}
              fill
              unoptimized
              className="object-cover object-center"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Briefcase className="h-20 w-20 text-[#71717A]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
      </div>

      {/* Title & Badges */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold text-[#A1A1AA] border border-[#27272A]">
            {career.industry}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold text-[#A1A1AA] border border-[#27272A]">
            {career.experienceLevel}
          </span>
          {career.rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-400/20">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {career.rating.toFixed(1)}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {career.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#A1A1AA] sm:text-base">
          {career.shortDescription}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Overview */}
          <Section title="Overview" icon={Target}>
            <p className="text-sm leading-relaxed text-[#A1A1AA] whitespace-pre-line">
              {career.description}
            </p>
          </Section>

          {/* Skills */}
          {career.skills.length > 0 && (
            <Section title="Required Skills" icon={CheckCircle}>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center rounded-full bg-[#4F46E5]/10 px-4 py-2 text-sm font-medium text-[#4F46E5] transition-colors hover:bg-[#4F46E5]/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Responsibilities */}
          {career.responsibilities.length > 0 && (
            <Section title="Responsibilities" icon={Briefcase}>
              <ul className="space-y-3">
                {career.responsibilities.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[#A1A1AA]"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10">
                      <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Job Outlook */}
          {career.jobOutlook && (
            <Section title="Job Outlook" icon={TrendingUp}>
              <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10">
                    <TrendingUp className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#10B981]">
                      {career.jobOutlook}
                    </p>
                  </div>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Career Summary Card */}
          <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Career Summary
            </h3>
            <div className="space-y-4">
              {/* Bangladesh Salary */}
              {career.salary?.bangladesh && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                      <MapPin className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Bangladesh Salary
                    </p>
                  </div>
                  <p className="text-lg font-bold text-blue-400">
                    {career.salary.bangladesh}
                  </p>
                </div>
              )}

              {/* International Opportunity */}
              {career.salary?.international && (
                <div className="rounded-xl border border-[#4F46E5]/20 bg-[#4F46E5]/10 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10">
                      <Globe className="h-4 w-4 text-[#4F46E5]" />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#4F46E5]">
                      International Opportunity
                    </p>
                  </div>
                  <p className="text-lg font-bold text-[#4F46E5]">
                    {career.salary.international}
                  </p>
                </div>
              )}

              {/* Experience Level */}
              <InfoRow
                icon={Briefcase}
                label="Experience Level"
                value={career.experienceLevel}
              />

              {/* Industry */}
              <InfoRow
                icon={Target}
                label="Industry"
                value={career.industry}
              />

              {/* Rating */}
              <InfoRow
                icon={Star}
                label="Rating"
                value={career.rating > 0 ? `${career.rating.toFixed(1)} / 5.0` : "Not rated"}
                highlight={career.rating > 0}
              />
            </div>
          </div>

          {/* CTA Card */}
          {user?.role !== "admin" && (
            <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F46E5] text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Interested in this career?
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                {user
                  ? "Create your career profile to get personalized AI recommendations and roadmaps."
                  : "Sign in to create your career profile and get personalized AI recommendations."}
              </p>
              {user ? (
                <Link
                  href={{
                    pathname: "/career-profile",
                    query: {
                      careerGoal: career.title,
                      preferredIndustry: career.industry,
                      experienceLevel: career.experienceLevel,
                      skills: career.skills.join(","),
                    },
                  }}
                  className="mt-5 block"
                >
                  <Button variant="primary" size="md" className="w-full gap-2 group/cta">
                    Create Your Career Profile
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="mt-5 block">
                  <Button variant="primary" size="md" className="w-full gap-2 group/cta">
                    Login to Create Career Profile
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Careers */}
      {relatedCareers.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-white">
            Related Careers in {career.industry}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCareers.map((c) => (
              <Link
                key={c._id}
                href={`/careers/${c._id}`}
                className="group flex flex-col rounded-2xl border border-[#27272A] bg-[#111111] transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden bg-[#18181B]">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Briefcase className="h-10 w-10 text-[#71717A]" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#4F46E5] transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#A1A1AA] line-clamp-2">
                    {c.shortDescription}
                  </p>
                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-[#18181B] px-2.5 py-1 text-xs font-medium text-[#A1A1AA]">
                      {c.experienceLevel}
                    </span>
                    {c.rating > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {c.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10">
          <Icon className="h-4 w-4 text-[#4F46E5]" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#A1A1AA]">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#18181B]">
        <Icon className={`h-4 w-4 ${highlight ? "text-amber-500" : "text-[#71717A]"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
          {label}
        </p>
        <p className={`text-sm font-semibold ${highlight ? "text-amber-400" : "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
