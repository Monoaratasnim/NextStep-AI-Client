"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, Mail } from "lucide-react";
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

function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const callbackUrl =
    searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
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
  };

  return (
    <div className="space-y-7">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-50/20">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to continue to your career dashboard
        </p>
      </div>

      <AuthCard>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-1.5">
            <FormField
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

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
      </AuthCard>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300 transition-colors underline-offset-2 hover:underline"
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
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
