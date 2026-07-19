"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import Button from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";

const trustItems = [
  "AI Recommendations",
  "Personalized Roadmaps",
  "Career Library",
];

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden bg-[#000000]">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#4F46E5]/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-[#4F46E5]/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#4F46E5]/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[45%_1fr] lg:gap-16">

          {/* Left — Text */}
          <div className="flex flex-col gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#27272A] bg-[#111111] px-4 py-1.5 text-sm font-medium text-[#A1A1AA] backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[#4F46E5]" />
              AI-Powered Career Guidance
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Find the Right{" "}
              <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                Career
              </span>{" "}
              with AI
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-[#A1A1AA]">
              Explore career paths, build a personalized profile, and receive
              AI-powered recommendations and learning roadmaps designed around
              your goals.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {!user ? (
                <Link href="/register">
                  <Button variant="primary" size="lg" className="group gap-2">
                    Start Your Career Journey
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="group gap-2">
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              )}
              <Link href="/careers">
                <Button variant="outline" size="lg">
                  Explore Career Library
                </Button>
              </Link>
            </div>

            <ul className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10">
                    <Check className="h-3 w-3 text-[#10B981]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Image Collage */}
          <div className="relative hidden h-[420px] lg:block xl:h-[480px]">
            {/* Decorative ring */}
            <div className="absolute inset-4 rounded-3xl border border-[#27272A]/60" />

            {/* Main large image */}
            <div className="group absolute left-0 top-0 h-[300px] w-[260px] xl:h-[340px] xl:w-[290px]">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#27272A] shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <Image
                  src="/images/hero1.jpg"
                  alt="Professional exploring career options on a laptop"
                  fill
                  priority
                  sizes="(max-width: 1024px) 0px, 290px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Top-right smaller image */}
            <div className="group absolute right-4 top-0 h-[180px] w-[180px] xl:right-6 xl:top-2 xl:h-[200px] xl:w-[200px]">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#27272A] shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <Image
                  src="/images/hero2.jpg"
                  alt="Team collaborating on career development strategies"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 0px, 200px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Bottom-right overlapping image */}
            <div className="group absolute bottom-0 right-2 h-[200px] w-[220px] xl:bottom-2 xl:right-8 xl:h-[230px] xl:w-[240px]">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#27272A] shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <Image
                  src="/images/hero3.jpg"
                  alt="Graduate celebrating career success"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 0px, 240px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-16 left-6 z-10 rounded-xl border border-[#27272A] bg-[#111111]/90 px-4 py-3 shadow-lg backdrop-blur-sm xl:bottom-20 xl:left-8">
              <p className="text-xs font-semibold text-white">
                🤖 AI-Powered Insights
              </p>
              <p className="mt-0.5 text-[11px] text-[#A1A1AA]">
                Personalized for you
              </p>
            </div>
          </div>

          {/* Mobile / Tablet — Compact image gallery */}
          <div className="flex gap-3 lg:hidden">
            <div className="relative h-40 flex-1 overflow-hidden rounded-2xl border border-[#27272A] shadow-sm">
              <Image
                src="/images/hero1.jpg"
                alt="Professional exploring career options"
                fill
                priority
                sizes="33vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-40 flex-1 overflow-hidden rounded-2xl border border-[#27272A] shadow-sm">
              <Image
                src="/images/hero2.jpg"
                alt="Team collaborating on career strategies"
                fill
                loading="lazy"
                sizes="33vw"
                className="object-cover"
              />
            </div>
            <div className="relative h-40 flex-1 overflow-hidden rounded-2xl border border-[#27272A] shadow-sm">
              <Image
                src="/images/hero3.jpg"
                alt="Graduate celebrating career success"
                fill
                loading="lazy"
                sizes="33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
