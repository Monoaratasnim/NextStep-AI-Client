"use client";

import { Search, User, Sparkles, Map } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explore Careers",
    description: "Browse our comprehensive library of career paths across industries.",
    number: "01",
  },
  {
    icon: User,
    title: "Create Career Profile",
    description: "Build your profile with skills, interests, and career goals.",
    number: "02",
  },
  {
    icon: Sparkles,
    title: "Receive AI Recommendations",
    description: "Get personalized career suggestions based on your profile.",
    number: "03",
  },
  {
    icon: Map,
    title: "Generate Personalized Roadmap",
    description: "Follow a step-by-step learning path to reach your career goals.",
    number: "04",
  },
];

export default function AIJourney() {
  return (
    <section className="bg-[#000000] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your AI Career Journey
          </h2>
          <p className="mt-3 text-base text-[#A1A1AA] max-w-2xl mx-auto">
            Four simple steps to discover and plan your ideal career path.
          </p>
        </div>
        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#27272A] lg:block" />
          <div className="grid gap-8 lg:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col gap-4 rounded-2xl border border-[#27272A] bg-[#111111] p-6 transition-all hover:shadow-lg hover:shadow-black/20 ${
                  index % 2 === 0 ? "lg:mr-12" : "lg:ml-12"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4F46E5] text-white">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-[#71717A]">
                    STEP {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
