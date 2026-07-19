"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900/40">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-zinc-850 dark:text-zinc-50 dark:border dark:border-zinc-800 text-sm",
        }}
      />

      {/* Desktop Sidebar (persistent, collapsible) */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        className="hidden md:flex shrink-0"
      />

      {/* Mobile Drawer Navigation Sidebar */}
      {isMobileOpen && (
        <div className="relative z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Drawer drawer content */}
          <div className="fixed inset-y-0 left-0 flex w-64 max-w-full bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex flex-col flex-1 h-full relative">
              {/* Close Button Inside Drawer */}
              <button
                onClick={closeMobileMenu}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Render Sidebar within Drawer context */}
              <Sidebar
                isCollapsed={false}
                setIsCollapsed={() => {}}
                className="w-full h-full border-r-0"
                onItemClick={closeMobileMenu}
              />
            </div>
          </div>
        </div>
      )}

      {/* Workspace container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header bar */}
        <Header onMenuToggle={toggleMobileMenu} />

        {/* Scrollable Work area content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 dark:bg-zinc-950/10 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
