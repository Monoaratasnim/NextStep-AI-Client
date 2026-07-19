"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/career-profile":
        return "Career Profile";
      case "/roadmap":
        return "Career Roadmap";
      case "/recommendation":
        return "Recommendations";
      default:
        return "Console";
    }
  };

  const notifications = [
    { id: 1, title: "New Career Recommendation", desc: "An updated node has been added to your roadmap.", time: "2m ago" },
    { id: 2, title: "Skills Assessment Complete", desc: "Your backend development skill score has been updated.", time: "1h ago" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/70 px-4 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/70 sm:px-6">
      {/* Left side: Hamburger (mobile) and page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 md:hidden"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Mock Search bar (Desktop) */}
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full rounded-full border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:focus:ring-zinc-700"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Notifications</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-2xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">2 New</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="group relative flex flex-col gap-1 rounded-xl p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{n.title}</span>
                    <span className="text-2xs text-zinc-500 dark:text-zinc-400 leading-normal">{n.desc}</span>
                    <span className="text-3xs font-medium text-zinc-400 dark:text-zinc-500 mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-800 focus:outline-none transition-all duration-200 active:scale-95"
            aria-label="User profile settings"
          >
            <div className="flex h-full w-full items-center justify-center font-semibold text-xs text-zinc-600 dark:text-zinc-300 bg-gradient-to-tr from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700">
              {user ? getInitials(user.fullName) : "?"}
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User details summary */}
              <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{user?.fullName || "Guest"}</p>
                <p className="text-3xs text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{user?.email || ""}</p>
              </div>

              {/* Action buttons */}
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="border-zinc-100 dark:border-zinc-800 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
