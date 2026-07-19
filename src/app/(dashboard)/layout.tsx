"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuth } from "@/hooks/useAuth";
import { X } from "lucide-react";

const ADMIN_ROUTES = ["/dashboard/manage-careers", "/dashboard/add-career"];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isUnauthorized = isAdminRoute && user && user.role !== "admin";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black">
      {/* Desktop Sidebar (persistent, collapsible) */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        className="hidden md:flex shrink-0"
      />

      {/* Mobile Drawer Navigation Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-in slide-in-from-left duration-300 ease-out">
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => {}}
              className="w-full h-full border-r-0 shrink-0"
              onItemClick={closeMobileMenu}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={closeMobileMenu}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#111111]/90 border border-[#27272A] text-[#A1A1AA] shadow-lg hover:bg-[#18181B] hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Workspace container */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header bar */}
        <Header onMenuToggle={toggleMobileMenu} />

        {/* Scrollable Work area content */}
        <main className="flex-1 overflow-y-auto bg-black p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {isUnauthorized ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/30">
                  <ShieldAlert className="h-8 w-8 text-rose-400" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">
                  Unauthorized Access
                </h2>
                <p className="mt-2 max-w-sm text-sm text-[#71717A]">
                  You do not have permission to view this page. Please
                  contact an administrator if you believe this is a mistake.
                </p>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
