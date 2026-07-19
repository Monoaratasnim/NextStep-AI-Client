"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/shared/Button";
import { useAuth } from "@/hooks/useAuth";

export default function CTA() {
  const { user } = useAuth();

  return (
    <section className="bg-[#111111] relative overflow-hidden py-16 sm:py-20">
      {/* Indigo glow accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5]/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Take the Next Step?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-[#A1A1AA]">
          Join thousands of professionals who are using AI to discover the right career path and plan their growth.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {!user ? (
            <>
              <Link href="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="group gap-2"
                >
                  Start Your Career Journey
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/careers">
                <Button
                  variant="outline"
                  size="lg"
                >
                  Explore Career Library
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                className="group gap-2"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
