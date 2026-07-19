"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Button from "./Button";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const prevPathname = useRef(pathname);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setMobileOpen(false);
      setDropdownOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
    logout();
    router.push("/");
  }, [logout, router]);

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

  const isAdmin = user?.role === "admin";

  const publicLinks = [
    { label: "Home", href: "/" },
    { label: "Career Library", href: "/careers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const userLinks = [
    { label: "Home", href: "/" },
    { label: "Career Library", href: "/careers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const adminLinks = [
    { label: "Home", href: "/" },
    { label: "Career Library", href: "/careers" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const navLinks = !user ? publicLinks : isAdmin ? adminLinks : userLinks;

  const dropdownItems = user
    ? isAdmin
      ? [
          { label: "Admin Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "My Profile", href: "/profile", icon: User },
        ]
      : [
          { label: "My Profile", href: "/profile", icon: User },
        ]
    : [];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#27272A]/50 bg-black/70 shadow-lg shadow-black/20 backdrop-blur-2xl"
          : "border-b border-transparent bg-black/70 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            NextStep<span className="text-[#A1A1AA]">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(link.href)
                  ? "text-[#4F46E5] bg-[#4F46E5]/10"
                  : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#4F46E5]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </Button>
              </Link>
              <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-[#27272A] bg-[#111111] py-1 pl-1 pr-2.5 transition-colors hover:bg-[#27272A]"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-semibold text-white">
                    {getInitials(user.fullName)}
                  </div>
                )}
                <span className="text-sm font-medium text-[#A1A1AA] max-w-[100px] truncate hidden xl:inline">
                  {user.fullName}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[#71717A] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#27272A] bg-[#111111] p-1.5 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info */}
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
                        {getInitials(user.fullName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-[#A1A1AA] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="my-1 h-px bg-[#27272A]" />

                  {/* Menu items */}
                  <div className="space-y-0.5">
                    {dropdownItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                            isActive(item.href)
                              ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                              : "text-[#A1A1AA] hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="my-1 h-px bg-[#27272A]" />

                  {/* Sign out */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
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
          onClick={() => setMobileOpen(!mobileOpen)}
          type="button"
          className="flex lg:hidden items-center justify-center rounded-lg p-2 text-[#A1A1AA] hover:bg-white/5 hover:text-white transition-colors"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full border-b border-[#27272A]/50 bg-[#0A0A0A]/95 shadow-lg backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl px-4 pt-3 pb-6">
            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                      : "text-[#A1A1AA] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <hr className="my-3 border-[#27272A]" />

            {user ? (
              <div className="flex flex-col gap-3">
                {/* User info */}
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-semibold text-white">
                      {getInitials(user.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-[#A1A1AA] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#A1A1AA] hover:bg-white/5 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {isAdmin ? "Admin Dashboard" : "Dashboard"}
                </Link>

                {/* Profile links */}
                {dropdownItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-[#4F46E5]/10 text-[#4F46E5]"
                          : "text-[#A1A1AA] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full">
                  <Button variant="primary" size="md" className="w-full justify-between group/btn">
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
