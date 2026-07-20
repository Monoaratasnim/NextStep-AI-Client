"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Star } from "lucide-react";
import { usePublicCareers } from "@/hooks/useCareerLibrary";
import { SkeletonBlock } from "@/components/shared/Loading";
import Button from "@/components/shared/Button";

export default function FeaturedCareers() {
  const { data, isLoading, error } = usePublicCareers({
    sort: "-rating",
    limit: 6,
  });

  const careers = data?.careers ?? [];

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Careers
            </h2>
            <p className="mt-3 text-base text-[#A1A1AA]">
              Top-rated career paths handpicked for you.
            </p>
          </div>
          <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#A1A1AA] transition-colors">
            View All Careers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {error ? (
          <div className="mt-10 flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-[#71717A]">
              Unable to load featured careers. Please try again later.
            </p>
          </div>
        ) : isLoading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-[#27272A]">
                <SkeletonBlock className="h-48 w-full rounded-none" />
                <div className="flex flex-1 flex-col p-5">
                  <SkeletonBlock className="h-5 w-3/4 rounded-lg" />
                  <SkeletonBlock className="mt-3 h-4 w-full rounded-lg" />
                  <SkeletonBlock className="mt-2 h-4 w-2/3 rounded-lg" />
                  <SkeletonBlock className="mt-auto h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : careers.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#27272A]">
              <Briefcase className="h-7 w-7 text-[#71717A]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              No careers available yet
            </h3>
            <p className="mt-1 text-sm text-[#71717A]">
              Check back soon for new career paths.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
                <div
                  key={career._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#27272A] bg-[#111111] transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden bg-[#0A0A0A]">
                    {career.image ? (
                      <Image
                        src={career.image}
                        alt={career.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Briefcase className="h-12 w-12 text-[#71717A]" />
                      </div>
                    )}
                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center rounded-lg bg-[#111111]/90 px-2.5 py-1 text-xs font-semibold text-[#A1A1AA] shadow-sm backdrop-blur-sm border border-[#27272A]">
                        {career.industry}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-white line-clamp-1">
                      {career.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#A1A1AA] line-clamp-2">
                      {career.shortDescription}
                    </p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-[#71717A]" />
                        <span className="text-sm text-[#A1A1AA]">
                          {career.experienceLevel}
                        </span>
                      </div>
                      {career.salary?.bangladesh && (
                        <p className="text-sm text-[#A1A1AA]">
                          {career.salary.bangladesh}
                        </p>
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
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/careers/${career._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!isLoading && !error && careers.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/careers">
              <Button variant="outline" size="lg" className="group gap-2">
                View All Careers
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
