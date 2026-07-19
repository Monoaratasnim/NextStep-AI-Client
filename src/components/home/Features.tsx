"use client";

import { Sparkles, Map, BookOpen, Target } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description:
      "Receive personalized career suggestions powered by advanced AI, tailored to your unique skills and interests.",
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    description:
      "Get step-by-step learning paths with milestones designed to help you reach your career goals efficiently.",
  },
  {
    icon: BookOpen,
    title: "Career Library",
    description:
      "Access a comprehensive database of career paths with detailed information on skills, salaries, and growth.",
  },
  {
    icon: Target,
    title: "Skill-based Planning",
    description:
      "Build your career plan around your existing skills and discover which new skills to develop next.",
  },
];

export default function Features() {
  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Choose NextStep AI
          </h2>
          <p className="mt-3 text-base text-[#A1A1AA] max-w-2xl mx-auto">
            Everything you need to make informed career decisions and plan your professional growth.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[#27272A] bg-[#111111] p-6 transition-all hover:shadow-lg hover:shadow-black/20 hover:border-[#3F3F46]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
