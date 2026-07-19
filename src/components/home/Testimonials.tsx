"use client";

import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Software Engineer at Google",
    content:
      "NextStep AI helped me identify the exact skills I needed to transition from web development to cloud engineering. The personalized roadmap was a game-changer.",
    avatar: "SA",
  },
  {
    name: "Rahim Khan",
    role: "Data Scientist at Microsoft",
    content:
      "The AI recommendations were spot-on. I followed the suggested learning path and landed my dream job within six months. Highly recommend this platform.",
    avatar: "RK",
  },
  {
    name: "Nadia Rahman",
    role: "Product Manager at Stripe",
    content:
      "As someone switching careers from marketing to tech, NextStep AI gave me clarity on what skills to develop and which roles matched my background.",
    avatar: "NR",
  },
  {
    name: "Tanvir Hassan",
    role: "DevOps Engineer at AWS",
    content:
      "The career library is incredibly detailed. I could compare different paths and make an informed decision about my specialization in cloud infrastructure.",
    avatar: "TH",
  },
  {
    name: "Priya Sharma",
    role: "UX Designer at Figma",
    content:
      "The platform's AI-driven insights helped me understand my strengths and weaknesses. The roadmap feature kept me accountable and on track.",
    avatar: "PS",
  },
  {
    name: "Arif Mahmud",
    role: "Backend Developer at Shopify",
    content:
      "I was confused about which direction to take in my career. NextStep AI's recommendations aligned perfectly with my interests and experience level.",
    avatar: "AM",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#000000] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-3 text-base text-[#A1A1AA] max-w-2xl mx-auto">
            Hear from professionals who have transformed their careers with NextStep AI.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 transition-all hover:shadow-lg hover:shadow-black/20"
            >
              <Quote className="h-8 w-8 text-[#71717A]" />
              <p className="mt-4 text-sm text-[#A1A1AA] leading-relaxed">
                {testimonial.content}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5]/10 text-sm font-semibold text-[#4F46E5]">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
