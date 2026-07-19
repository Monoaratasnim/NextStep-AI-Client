import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Route,
  BrainCircuit,
  Target,
  TrendingUp,
  Quote,
} from "lucide-react";

const features = [
  { icon: BrainCircuit, label: "AI-powered career analysis" },
  { icon: Route, label: "Personalized skill roadmaps" },
  { icon: Target, label: "Goal-oriented milestones" },
  { icon: TrendingUp, label: "Progress tracking & insights" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-30 md:left-auto md:right-6 lg:right-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-105 md:border-zinc-200/80 md:bg-white/80 md:text-zinc-600 md:hover:bg-zinc-50 md:hover:text-zinc-950 dark:md:border-zinc-800/80 dark:md:bg-zinc-900/80 dark:md:text-zinc-400 dark:md:hover:bg-zinc-800 dark:md:hover:text-zinc-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
      </div>

      {/* Left Panel: Branding */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 p-12 text-white lg:flex">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl animate-pulse [animation-delay:2s]" />

        {/* Brand Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              NextStep<span className="text-zinc-400">AI</span>
            </span>
          </Link>
        </div>

        {/* Tagline + Features */}
        <div className="relative z-10 max-w-md space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
              Shape your future with{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                AI-driven
              </span>{" "}
              career guidance
            </h2>
            <p className="text-base leading-relaxed text-zinc-400">
              Get a personalized roadmap, skill recommendations, and milestones
              crafted specifically for your career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/10"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <f.icon className="h-5 w-5 text-indigo-300" />
                </div>
                <span className="text-sm font-medium text-zinc-300">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-4 w-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <Quote className="mb-2 h-5 w-5 text-zinc-600" />
            <p className="text-sm leading-relaxed text-zinc-300 italic">
              &ldquo;NextStep AI took the guesswork out of my career transition.
              The AI recommendations map out precisely what skills I need to
              acquire to land a Staff Engineer role.&rdquo;
            </p>
            <footer className="mt-3 text-xs font-semibold tracking-wide text-zinc-500">
              &mdash; Sarah Jenkins, Staff Software Engineer
            </footer>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} NextStep AI. Empowering careers
          globally.
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
