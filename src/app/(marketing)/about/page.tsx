"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Map,
  BookOpen,
  Target,
  TrendingUp,
  BarChart3,
  User,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";
import Button from "@/components/shared/Button";
import Statistics from "@/components/home/Statistics";
import { useAuth } from "@/hooks/useAuth";

const missionItems = [
  "Discover careers that match your skills and interests",
  "Build a comprehensive career profile with AI assistance",
  "Receive personalized AI-powered career recommendations",
  "Generate step-by-step learning roadmaps for your goals",
  "Plan long-term career growth with data-driven insights",
];

const reasons = [
  {
    icon: Sparkles,
    title: "AI Career Recommendations",
    description:
      "Get intelligent career suggestions powered by advanced AI, tailored to your unique skills, interests, and experience level.",
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    description:
      "Receive step-by-step learning paths with milestones and resources designed to help you reach your career goals efficiently.",
  },
  {
    icon: BookOpen,
    title: "Career Library",
    description:
      "Access a comprehensive database of career paths with detailed information on skills, salaries, and growth opportunities.",
  },
  {
    icon: Target,
    title: "Modern Learning Paths",
    description:
      "Follow curated learning trajectories built around current industry demands and the latest technology trends.",
  },
  {
    icon: BarChart3,
    title: "Data-driven Guidance",
    description:
      "Make informed career decisions backed by real market data, salary insights, and industry growth projections.",
  },
  {
    icon: TrendingUp,
    title: "Professional Growth",
    description:
      "Track your progress, identify skill gaps, and continuously improve your professional profile for better opportunities.",
  },
];

const steps = [
  {
    icon: User,
    title: "Create Career Profile",
    description:
      "Build your profile with your skills, interests, experience level, and career aspirations.",
    number: "01",
  },
  {
    icon: Zap,
    title: "AI Analysis",
    description:
      "Our AI analyzes your profile against market data, industry trends, and career patterns to find the best matches.",
    number: "02",
  },
  {
    icon: Sparkles,
    title: "Receive Recommendations",
    description:
      "Get personalized career suggestions ranked by fit, along with salary insights and growth projections.",
    number: "03",
  },
  {
    icon: Map,
    title: "Generate Roadmap",
    description:
      "Follow a step-by-step learning path with milestones, resources, and timelines to reach your career goals.",
    number: "04",
  },
];

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#000000]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#4F46E5]/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-[#4F46E5]/15 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#27272A] bg-[#111111] px-4 py-1.5 text-sm font-medium text-[#A1A1AA]">
                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                About NextStep AI
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
                Empowering Careers{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
                  with AI
                </span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-[#A1A1AA]">
                We&apos;re on a mission to help developers and tech professionals
                design personalized career roadmaps and master the skills that
                matter most using advanced artificial intelligence.
              </p>
            </div>
            <div className="relative hidden h-[380px] lg:block xl:h-[420px]">
              <div className="absolute inset-4 rounded-3xl border border-[#27272A]/60" />
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#27272A] shadow-xl">
                <Image
                  src="/images/hero1.jpg"
                  alt="Team collaborating on career development"
                  fill
                  priority
                  sizes="(max-width: 1024px) 0px, 500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/10 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-xl border border-[#27272A] bg-[#111111]/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                <p className="text-sm font-semibold text-white">
                  AI-Powered Insights
                </p>
                <p className="mt-0.5 text-xs text-[#A1A1AA]">
                  Trusted by thousands
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
                NextStep AI was built to bridge the gap between ambition and
                action. We believe every tech professional deserves
                personalized, AI-powered guidance to navigate their career with
                confidence.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
                Our platform empowers you to:
              </p>
              <ul className="mt-6 space-y-3">
                {missionItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10">
                      <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                    </div>
                    <span className="text-sm text-[#A1A1AA]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative h-[360px] overflow-hidden rounded-2xl border border-[#27272A] shadow-xl">
                <Image
                  src="/images/hero2.jpg"
                  alt="Professionals collaborating on career growth"
                  fill
                  loading="lazy"
                  sizes="500px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose NextStep AI */}
      <section className="bg-[#000000] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Choose NextStep AI
            </h2>
            <p className="mt-3 text-base text-[#A1A1AA] max-w-2xl mx-auto">
              Everything you need to make informed career decisions and plan
              your professional growth.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="group rounded-2xl border border-[#27272A] bg-[#111111] p-6 transition-all hover:shadow-lg hover:shadow-black/20 hover:border-[#3F3F46]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                  <reason.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
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

      {/* Platform Statistics */}
      <Statistics />

      {/* CTA */}
      <section className="bg-[#111111] relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5]/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Continue Your Career Journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#A1A1AA]">
            Join thousands of professionals who are using AI to discover the
            right career path and plan their growth.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/careers">
              <Button variant="primary" size="lg" className="group gap-2">
                Explore Career Library
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            {!user ? (
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Start Your Career Journey
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
