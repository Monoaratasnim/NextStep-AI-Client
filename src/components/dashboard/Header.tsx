"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { searchItems, adminSearchItems } from "@/constants/search";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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
      case "/profile":
        return "My Profile";
      case "/dashboard/manage-careers":
        return "Manage Careers";
      case "/dashboard/add-career":
        return "Add Career";
      default:
        return "Console";
    }
  };

  const filteredResults = useMemo(() => {
    const items = user?.role === "admin"
      ? [...searchItems, ...adminSearchItems]
      : searchItems;
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.includes(q))
    );
  }, [searchQuery, user?.role]);

  const handleSearchSelect = useCallback(
    (href: string) => {
      setShowSearch(false);
      setSearchQuery("");
      router.push(href);
    },
    [router]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearch(false);
        setSearchQuery("");
      }
    }
    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfile]);

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredResults.length - 1
      );
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSearchSelect(filteredResults[selectedIndex].href);
    }
  }

  const handleLogout = () => {
    setShowProfile(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#27272A] bg-[#0A0A0A]/70 px-4 backdrop-blur-2xl sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#27272A] bg-[#111111] text-[#A1A1AA] hover:bg-[#18181B] hover:text-white md:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold tracking-tight text-white">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#27272A] bg-[#111111] text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#18181B] md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Desktop Search Trigger */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex h-10 w-64 items-center gap-2 rounded-full border border-[#27272A] bg-[#111111] px-4 text-xs text-[#71717A] transition-colors hover:text-[#A1A1AA] hover:bg-[#18181B]"
          >
            <Search className="h-4 w-4 shrink-0" />
            Search dashboard...
            <kbd className="ml-auto rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-3xs font-medium text-[#71717A]">
              Ctrl K
            </kbd>
          </button>

          {/* Profile Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#27272A] bg-[#111111] hover:border-[#4F46E5]/40 focus:outline-none transition-all duration-200 active:scale-95"
              aria-label="User menu"
            >
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-semibold text-xs text-[#A1A1AA] bg-[#18181B]">
                  {user ? getInitials(user.fullName) : "?"}
                </div>
              )}
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-[#27272A] bg-[#111111] shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#18181B]">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt={user.fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-semibold text-xs text-[#A1A1AA] bg-[#18181B]">
                        {user ? getInitials(user.fullName) : "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.fullName || "Guest"}
                    </p>
                    <p className="text-xs text-[#A1A1AA] truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#27272A]" />

                {/* Menu items */}
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      setShowProfile(false);
                      router.push("/profile");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-[#A1A1AA] hover:bg-[#18181B] hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-[#71717A]" />
                    My Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
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

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => {
              setShowSearch(false);
              setSearchQuery("");
            }}
          />
          <div
            ref={searchContainerRef}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[#27272A] bg-[#111111] shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200 mx-4"
          >
            <div className="flex items-center gap-2 border-b border-[#27272A] px-4">
              <Search className="h-4 w-4 text-[#71717A]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search pages and features..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder:text-[#71717A] focus:outline-none"
              />
              <kbd className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-3xs font-medium text-[#71717A]">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {filteredResults.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-[#71717A]">
                    No results found
                  </p>
                </div>
              ) : (
                filteredResults.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href + item.label}
                      onClick={() => handleSearchSelect(item.href)}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        i === selectedIndex
                          ? "bg-[#4F46E5]/10"
                          : "hover:bg-[#18181B]"
                      }`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#18181B]">
                        <Icon className="h-4 w-4 text-[#71717A]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white">
                          {item.label}
                        </p>
                        <p className="text-3xs text-[#71717A] truncate">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
