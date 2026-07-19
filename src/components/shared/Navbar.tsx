"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "./Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-200/30 bg-white/70 shadow-sm shadow-zinc-200/20 backdrop-blur-2xl dark:border-zinc-800/30 dark:bg-zinc-950/70 dark:shadow-zinc-900/20"
          : "border-b border-transparent bg-white/50 backdrop-blur-md dark:bg-zinc-950/50"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 transition-all duration-300 group-hover:rotate-12 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            NextStep<span className="text-zinc-400 dark:text-zinc-500">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(link.href)
                  ? "text-zinc-950 dark:text-zinc-50 bg-zinc-100/80 dark:bg-zinc-800/60"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-50" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center gap-2.5 rounded-full border border-zinc-200/80 bg-zinc-50/80 py-1 pl-1 pr-3 dark:border-zinc-800/80 dark:bg-zinc-900/80">
                {user.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.fullName}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-xs font-semibold text-white dark:from-zinc-300 dark:to-zinc-100 dark:text-zinc-900">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">
                  {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="group/btn">
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 transition-colors"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full border-b border-zinc-200/50 bg-white/95 px-4 pt-2 pb-6 shadow-lg backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/95 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900/60 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <hr className="my-3 border-zinc-200 dark:border-zinc-800" />

          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-3.5 py-2">
                {user.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.fullName}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-sm font-semibold text-white dark:from-zinc-300 dark:to-zinc-100 dark:text-zinc-900">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" size="md" className="w-full justify-between group/btn">
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="md"
                className="w-full justify-start gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-300"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="primary" size="md" className="w-full justify-between group/btn">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
