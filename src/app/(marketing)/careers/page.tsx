"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Star,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import { usePublicCareers } from "@/hooks/useCareerLibrary";
import { SkeletonBlock, EmptyState, ErrorState } from "@/components/shared/Loading";
import Button from "@/components/shared/Button";
import type { ICareerLibrary, CareerLibraryQueryParams } from "@/types/career-library";

const ITEMS_PER_PAGE = 12;

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Engineering",
  "Design",
  "Science",
  "Legal",
  "Other",
];

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

const sortOptions = [
  { value: "-createdAt", label: "Newest First" },
  { value: "-rating", label: "Highest Rating" },
  { value: "rating", label: "Lowest Rating" },
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
];

export default function CareersPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo<CareerLibraryQueryParams>(
    () => ({
      search: search || undefined,
      industry: industry || undefined,
      experienceLevel: experienceLevel || undefined,
      sort,
      page,
      limit: ITEMS_PER_PAGE,
    }),
    [search, industry, experienceLevel, sort, page]
  );

  const { data, isLoading, error } = usePublicCareers(queryParams);

  const careers = data?.careers ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setPage(1);
    },
    []
  );

  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setExperienceLevel("");
    setSort("-createdAt");
    setPage(1);
  };

  const hasActiveFilters = search || industry || experienceLevel || sort !== "-createdAt";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Career Library
        </h1>
        <p className="mt-3 text-base text-[#A1A1AA] max-w-2xl mx-auto">
          Explore career paths, required skills, and salary ranges to find
          your next opportunity.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="mx-auto mb-6 max-w-xl"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search careers by title..."
            className="w-full rounded-2xl border border-[#27272A] bg-[#111111] py-3 pl-11 pr-4 text-sm text-white placeholder:text-[#71717A] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
          />
        </div>
      </form>

      {/* Filters Toggle */}
      <div className="mb-6 flex items-center justify-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-full border border-[#27272A] bg-[#111111] px-4 py-2 text-sm font-medium text-[#A1A1AA] transition-colors hover:bg-[#1A1A1A]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5] text-xs text-white">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 rounded-2xl border border-[#27272A] bg-[#111111] p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Industry */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              >
                <option value="">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              >
                <option value="">All Levels</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wider text-[#A1A1AA]">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#0A0A0A] px-3 py-2.5 text-sm text-white focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-[#71717A] hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      {!isLoading && (
        <p className="mb-6 text-sm text-[#71717A]">
          {total === 0
            ? "No careers found"
            : `Showing ${(page - 1) * ITEMS_PER_PAGE + 1}–${Math.min(page * ITEMS_PER_PAGE, total)} of ${total} careers`}
        </p>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#27272A] bg-[#111111]"
            >
              <SkeletonBlock className="h-48 w-full" />
              <div className="flex flex-1 flex-col p-5">
                <SkeletonBlock className="mb-2 h-5 w-3/4 rounded-lg" />
                <SkeletonBlock className="mb-3 h-4 w-full rounded-lg" />
                <SkeletonBlock className="mb-3 h-4 w-2/3 rounded-lg" />
                <div className="mb-4 space-y-2">
                  <SkeletonBlock className="h-3.5 w-full rounded-lg" />
                  <SkeletonBlock className="h-3.5 w-3/4 rounded-lg" />
                </div>
                <SkeletonBlock className="mt-auto h-11 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          message={error.message || "Failed to load careers. Please try again."}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && careers.length === 0 && (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No careers found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            hasActiveFilters ? (
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Career Cards Grid */}
      {!isLoading && !error && careers.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {careers.map((career) => (
            <CareerCard key={career._id} career={career} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 items-center gap-1 rounded-full border border-[#27272A] bg-[#111111] px-3.5 text-sm font-medium text-[#A1A1AA] transition-colors hover:bg-[#1A1A1A] disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1 text-sm text-[#71717A]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      page === item
                        ? "bg-[#4F46E5] text-white"
                        : "text-[#71717A] hover:bg-[#111111]"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 items-center gap-1 rounded-full border border-[#27272A] bg-[#111111] px-3.5 text-sm font-medium text-[#A1A1AA] transition-colors hover:bg-[#1A1A1A] disabled:opacity-40 disabled:pointer-events-none"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}


function CareerCard({ career }: { career: ICareerLibrary }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#27272A] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[#18181B]">
        {career.image ? (
          <Image
            src={career.image}
            alt={career.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Briefcase className="h-12 w-12 text-[#71717A]" />
          </div>
        )}
        {/* Industry Badge */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center rounded-lg bg-[#111111]/90 px-2.5 py-1 text-xs font-semibold text-[#A1A1AA] border border-[#27272A] backdrop-blur-sm">
            {career.industry}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-white line-clamp-2 transition-colors group-hover:text-[#A1A1AA]">
          {career.title}
        </h3>
        <p className="mt-2 text-sm text-[#A1A1AA] line-clamp-2">
          {career.shortDescription}
        </p>

        {/* Career Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#71717A]" />
            <span className="text-sm text-[#A1A1AA]">
              {career.experienceLevel}
            </span>
          </div>
          {career.salary?.bangladesh && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#A1A1AA]">
                {career.salary.bangladesh}
              </span>
            </div>
          )}
          {career.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-[#A1A1AA]">
                {career.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Button */}
        <div className="mt-auto pt-5">
          <Link
            href={`/careers/${career._id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4338CA] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 focus:ring-offset-[#111111]"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
