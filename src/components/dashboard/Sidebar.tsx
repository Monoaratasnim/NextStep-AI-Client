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
} from "lucide-react";

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
  const [mounted, setMounted] = useState(false);

  // Sync state with localStorage on mount
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

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Career Profile", href: "/career-profile", icon: User },
    { label: "Roadmap", href: "/roadmap", icon: Map },
    { label: "Recommendations", href: "/recommendation", icon: Lightbulb },
  ];

  const isActive = (href: string) => pathname === href;

  // Don't render the persistent toggle button on mobile drawers (where onItemClick exists)
  const isMobileDrawer = !!onItemClick;

  return (
    <aside
      className={`relative flex h-full flex-col border-r border-zinc-200 bg-white text-zinc-900 transition-all duration-300 ease-in-out dark:border-zinc-900 dark:bg-zinc-950 ${
        isCollapsed ? "w-20" : "w-64"
      } ${className}`}
    >
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200/50 dark:border-zinc-900/50">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 transition-transform duration-300 group-hover:rotate-12">
            <Sparkles className="h-5 w-5" />
          </div>
          <span
            className={`text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            NextStep<span className="text-zinc-500 dark:text-zinc-400">AI</span>
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span
                className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                {item.label}
              </span>

              {/* Tooltip on collapse hover */}
              {isCollapsed && mounted && (
                <div className="absolute left-16 z-50 invisible opacity-0 rounded-lg bg-zinc-950 px-2 py-1 text-xs text-white border border-zinc-800 shadow-md transition-all group-hover:visible group-hover:opacity-100 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Persistent Collapse Button (Desktop Only) */}
      {!isMobileDrawer && mounted && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 focus:outline-none"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </aside>
  );
}
