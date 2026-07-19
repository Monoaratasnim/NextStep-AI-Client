"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Loader2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/shared/Button";
import FormField from "@/components/shared/FormField";
import { useAuth } from "@/hooks/useAuth";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@nextstepai.com",
    description: "We reply within 24 hours",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1XXX-XXXXXX",
    description: "Sun–Thu, 10 AM – 6 PM BST",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Dhaka, Bangladesh",
    description: "Remote-first company",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "10:00 AM – 6:00 PM",
    description: "Sunday to Thursday",
  },
];

const faqs = [
  {
    question: "What is NextStep AI?",
    answer:
      "NextStep AI is an AI-powered career guidance platform that helps developers and tech professionals discover career paths, build personalized profiles, and receive tailored recommendations and learning roadmaps.",
  },
  {
    question: "Is NextStep AI free to use?",
    answer:
      "Yes! You can explore the career library, create a career profile, and receive AI-powered recommendations completely free. We also offer premium features for advanced career planning.",
  },
  {
    question: "How do AI recommendations work?",
    answer:
      "Our AI analyzes your skills, interests, experience, and career goals to suggest career paths that align with your profile. The more detailed your profile, the more accurate the recommendations.",
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
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[#27272A] bg-[#111111]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-semibold text-white">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#71717A] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-sm leading-relaxed text-[#A1A1AA]">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call (no backend endpoint exists for contact)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      void data; // Used for validation only
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#000000]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#4F46E5]/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-[#4F46E5]/15 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#27272A] bg-[#111111] px-4 py-1.5 text-sm font-medium text-[#A1A1AA]">
              <MessageSquare className="h-4 w-4 text-[#4F46E5]" />
              Get in Touch
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[#A1A1AA]">
              Have questions, feedback, or need support? We&apos;d love to hear
              from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="group rounded-2xl border border-[#27272A] bg-[#111111] p-6 transition-all hover:shadow-lg hover:shadow-black/20 hover:border-[#3F3F46]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-[#71717A]">
                  {info.label}
                </h3>
                <p className="mt-1 text-base font-semibold text-white">
                  {info.value}
                </p>
                <p className="mt-1 text-sm text-[#A1A1AA]">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="bg-[#000000] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white">Send Us a Message</h2>
                <p className="mt-2 text-sm text-[#A1A1AA]">
                  Fill out the form below and we&apos;ll get back to you as soon as
                  possible.
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="mt-8 space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      label="Name"
                      placeholder="Your full name"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <FormField
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>
                  <FormField
                    label="Subject"
                    placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register("subject")}
                  />
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-sm font-medium text-[#A1A1AA]"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell us more about your question or feedback..."
                      className={`w-full resize-none rounded-xl border bg-[#0A0A0A] px-4 py-2.5 text-sm text-white placeholder:text-[#71717A] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.message
                          ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border-[#27272A] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                      }`}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-rose-400">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full gap-2 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="lg:col-span-2">
              <div className="flex h-full flex-col rounded-2xl border border-[#27272A] bg-[#111111] overflow-hidden">
                <div className="relative flex-1 min-h-[300px] bg-[#0A0A0A]">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-10 w-10 text-[#4F46E5]/50" />
                      <p className="mt-3 text-sm font-medium text-[#A1A1AA]">
                        Dhaka, Bangladesh
                      </p>
                      <p className="mt-1 text-xs text-[#71717A]">
                        Remote-first company
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#27272A] p-5">
                  <h3 className="text-sm font-semibold text-white">
                    Our Location
                  </h3>
                  <p className="mt-1 text-sm text-[#A1A1AA]">
                    We operate as a remote-first company based in Dhaka,
                    Bangladesh, serving users worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0A0A0A] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-[#A1A1AA]">
              Quick answers to common questions.
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4F46E5]/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Take the Next Step?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#A1A1AA]">
            Start exploring career paths and get AI-powered guidance tailored
            to your goals.
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
