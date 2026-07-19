"use client";

import React, { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, Mail, User, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants";
import FormField from "@/components/shared/FormField";
import PasswordInput from "@/components/shared/PasswordInput";
import Button from "@/components/shared/Button";
import AuthCard from "@/components/shared/AuthCard";
import AuthDivider from "@/components/shared/AuthDivider";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

const demoAccounts = [
  {
    label: "Demo Admin",
    icon: Shield,
    email: "admin@gmail.com",
    password: "Admin@123",
    color: "text-[#4F46E5]",
    bg: "bg-[#4F46E5]/10",
    hoverBg: "hover:bg-[#4F46E5]/20",
    border: "border-[#4F46E5]/20",
  },
  {
    label: "Demo User",
    icon: User,
    email: "demo.user@gmail.com",
    password: "User@123",
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
    hoverBg: "hover:bg-[#10B981]/20",
    border: "border-[#10B981]/20",
  },
];

function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl =
    searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = useCallback(async (values: LoginValues) => {
    setIsSubmitting(true);
    try {
      await login(values, callbackUrl);
      toast.success("Welcome back!");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [login, callbackUrl]);

  const handleDemoLogin = useCallback(
    async (email: string, password: string) => {
      setValue("email", email, { shouldValidate: true });
      setValue("password", password, { shouldValidate: true });
      await new Promise((r) => setTimeout(r, 50));
      handleSubmit(onSubmit)();
    },
    [setValue, handleSubmit, onSubmit]
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/20">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Sign in to continue to your career dashboard
        </p>
      </div>

      <AuthCard>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isSubmitting}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <AuthDivider />
        </div>

        <div className="mt-6">
          <GoogleLoginButton redirectTo={callbackUrl} />
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-[#71717A]">
            Quick demo access
          </p>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((demo) => (
              <button
                key={demo.label}
                type="button"
                onClick={() => handleDemoLogin(demo.email, demo.password)}
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-xl border ${demo.border} ${demo.bg} ${demo.hoverBg} px-3 py-2.5 text-xs font-medium ${demo.color} transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none`}
              >
                <demo.icon className="h-3.5 w-3.5" />
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </AuthCard>

      <p className="text-center text-sm text-[#71717A]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#4F46E5] hover:text-[#6366F1] transition-colors underline-offset-2 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#71717A]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
