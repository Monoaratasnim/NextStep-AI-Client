"use client";

import React from "react";
import {
  Bell,
  Palette,
  Shield,
  User,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#71717A]" />
        <p className="mt-4 text-sm text-[#A1A1AA]">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h2>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Account Settings */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10">
            <User className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Account
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Your basic account information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingField
            label="Full Name"
            value={user?.fullName || ""}
            disabled
          />
          <SettingField
            label="Email Address"
            value={user?.email || ""}
            disabled
          />
        </div>

        <div className="mt-4 rounded-xl bg-[#18181B] px-4 py-3">
          <p className="text-xs text-[#71717A]">
            Account information is managed through your authentication provider.
            To update your name or email, please contact support.
          </p>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10">
            <Bell className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Notifications
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Control how you receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <ToggleSetting
            label="Profile updates"
            description="Receive notifications when your profile is created or updated"
            defaultChecked
            disabled
          />
          <ToggleSetting
            label="AI recommendations"
            description="Get notified when new recommendations are generated"
            defaultChecked
            disabled
          />
          <ToggleSetting
            label="Roadmap updates"
            description="Notifications for roadmap generation and updates"
            defaultChecked
            disabled
          />
        </div>

        <div className="mt-4 rounded-xl bg-[#18181B] px-4 py-3">
          <p className="text-xs text-[#71717A]">
            Advanced notification preferences (email, push) will be available in a
            future update.
          </p>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10">
            <Palette className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Appearance
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Customize the look and feel
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#18181B] px-4 py-3">
          <p className="text-xs text-[#71717A]">
            Theme settings (dark/light mode toggle, accent colors) will be
            available in a future update.
          </p>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5]/10">
            <Shield className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Security
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Protect your account
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-[#18181B] px-4 py-3">
          <p className="text-xs text-[#71717A]">
            Password change, two-factor authentication, and session management
            will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingField({
  label,
  value,
  disabled,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[#A1A1AA]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        className="w-full rounded-xl border border-[#27272A] bg-[#0A0A0A] px-3.5 py-2.5 text-xs text-white focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  defaultChecked = false,
  disabled = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#27272A] bg-[#0A0A0A] px-4 py-3">
      <div className="min-w-0 flex-1 mr-4">
        <p className="text-xs font-medium text-white">
          {label}
        </p>
        <p className="text-3xs text-[#A1A1AA] mt-0.5">
          {description}
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-not-allowed items-center rounded-full transition-colors ${
          defaultChecked
            ? "bg-[#4F46E5]"
            : "bg-[#27272A]"
        } opacity-60`}
        role="switch"
        aria-checked={defaultChecked}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            defaultChecked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
