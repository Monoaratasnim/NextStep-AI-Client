"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is NextStep AI?",
    answer:
      "NextStep AI is an AI-powered career guidance platform that helps you explore career paths, create personalized profiles, and receive tailored career recommendations and learning roadmaps.",
  },
  {
    question: "How do AI recommendations work?",
    answer:
      "Our AI analyzes your skills, interests, experience, and career goals to suggest career paths that align with your profile. The more detailed your profile, the more accurate the recommendations.",
  },
  {
    question: "Is NextStep AI free to use?",
    answer:
      "Yes! You can explore the career library, create a profile, and receive AI-powered recommendations completely free. We also offer premium features for advanced career planning.",
  },
  {
    question: "Can I use it for career switching?",
    answer:
      "Absolutely. NextStep AI is designed to help both fresh graduates and experienced professionals looking to transition into new roles or industries.",
  },
  {
    question: "How accurate are the salary estimates?",
    answer:
      "Salary estimates are based on aggregated market data for Bangladesh and international markets. They serve as general guidelines and may vary based on location, company size, and experience.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "You can browse the career library without an account, but creating a free account unlocks AI recommendations, personalized roadmaps, and career profile management.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#0A0A0A] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-[#A1A1AA]">
            Got questions? We have answers.
          </p>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-[#27272A] bg-[#111111] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-[#71717A] transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ${openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm text-[#A1A1AA] leading-relaxed">
                    {faq.answer}
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
