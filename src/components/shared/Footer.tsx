"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import Button from "./Button";

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill="currentColor" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="currentColor" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Mock subscription handler
      alert(`Subscribed ${email} to our newsletter!`);
      setEmail("");
    }
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Roadmaps", href: "/roadmap" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "#careers" },
        { label: "Blog", href: "#blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "Help Center", href: "#help" },
        { label: "Guides", href: "#guides" },
        { label: "Privacy Policy", href: "#privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <TwitterIcon className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <GithubIcon className="h-5 w-5" />, href: "https://github.com", label: "GitHub" },
    { icon: <LinkedinIcon className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full border-t border-zinc-200/50 bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Logo and Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 transition-transform duration-300 group-hover:rotate-12">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                NextStep<span className="text-zinc-500 dark:text-zinc-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Empowering developers and tech professionals to design personalized career roadmaps and master necessary skills using advanced AI.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-all duration-200 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {footerLinks.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Column */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-50 uppercase">
                  Stay updated
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Subscribe to get the latest guides and feature announcements.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400 pointer-events-none">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm" className="whitespace-nowrap rounded-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200/50 pt-8 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} NextStep AI. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Empowered by Advanced Agentic Intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
