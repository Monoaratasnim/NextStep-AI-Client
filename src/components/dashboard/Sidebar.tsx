"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Lightbulb,
  Map,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  PlusCircle,
  Home,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  className?: string;
  onItemClick?: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  className = "",
  onItemClick,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      setTimeout(() => {
        setIsCollapsed(parsed);
      }, 0);
    }
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, [setIsCollapsed]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(nextState));
  };

  const isAdmin = user?.role === "admin";

  const menuItems = isAdmin
    ? [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Manage Careers", href: "/dashboard/manage-careers", icon: Users },
        { label: "Add Career", href: "/dashboard/add-career", icon: PlusCircle },
      ]
    : [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Career Profile", href: "/career-profile", icon: User },
        { label: "Roadmap", href: "/roadmap", icon: Map },
        { label: "Recommendations", href: "/recommendation", icon: Lightbulb },
      ];

  const bottomItems = [
    { label: "My Profile", href: "/profile", icon: User },
  ];

  const isActive = (href: string) => pathname === href;
  const isMobileDrawer = !!onItemClick;

  return (
    <div
      className={`relative shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
    >
      <aside
        className={`flex h-full flex-col border-r border-[#27272A] bg-[#0A0A0A] text-white ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#27272A] px-5">
          <Link
            href="/dashboard"
            onClick={onItemClick}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5] text-white transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </div>
            <span
              className={`text-base font-bold tracking-tight text-white transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              NextStep
              <span className="text-[#71717A]">AI</span>
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto min-h-0">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/20"
                    : "text-[#71717A] hover:text-white hover:bg-[#111111]"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span
                  className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {item.label}
                </span>

                {/* Tooltip when collapsed */}
                {isCollapsed && mounted && (
                  <div className="absolute left-full ml-3 z-50 invisible opacity-0 rounded-lg bg-[#18181B] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg border border-[#27272A] transition-all duration-150 group-hover:visible group-hover:opacity-100 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-[#27272A] px-3 py-3 space-y-1">
          {/* Back to Home */}
          <Link
            href="/"
            onClick={onItemClick}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group ${
              pathname === "/"
                ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/20"
                : "text-[#71717A] hover:text-white hover:bg-[#111111]"
            }`}
          >
            <Home className="h-[18px] w-[18px] shrink-0" />
            <span
              className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              Back to Home
            </span>

            {isCollapsed && mounted && (
              <div className="absolute left-full ml-3 z-50 invisible opacity-0 rounded-lg bg-[#18181B] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg border border-[#27272A] transition-all duration-150 group-hover:visible group-hover:opacity-100 whitespace-nowrap">
                Back to Home
              </div>
            )}
          </Link>

          <div className="h-px bg-[#27272A] mx-1" />

          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-[#4F46E5] text-white shadow-sm shadow-[#4F46E5]/20"
                    : "text-[#71717A] hover:text-white hover:bg-[#111111]"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span
                  className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {item.label}
                </span>

                {isCollapsed && mounted && (
                  <div className="absolute left-full ml-3 z-50 invisible opacity-0 rounded-lg bg-[#18181B] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg border border-[#27272A] transition-all duration-150 group-hover:visible group-hover:opacity-100 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Collapse Toggle Button (Desktop Only) */}
      {!isMobileDrawer && mounted && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-[72px] z-30 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-[#27272A] bg-[#111111] text-[#71717A] shadow-sm transition-colors duration-150 hover:bg-[#18181B] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/40 focus:ring-offset-1 focus:ring-offset-black"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
}
