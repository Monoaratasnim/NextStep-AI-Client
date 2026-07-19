"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, UserPlus, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FormField from "@/components/shared/FormField";
import PasswordInput from "@/components/shared/PasswordInput";
import Button from "@/components/shared/Button";
import AuthCard from "@/components/shared/AuthCard";
import AuthDivider from "@/components/shared/AuthDivider";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";
import PasswordStrength from "@/components/shared/PasswordStrength";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");
  const watchedConfirm = watch("confirmPassword");
  const passwordsMatch =
    watchedConfirm && watchedPassword === watchedConfirm;

  const onSubmit = async (values: RegisterValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/20">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Create your account
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Start building your personalized career roadmap
        </p>
      </div>

      <AuthCard>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormField
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isSubmitting}
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-2">
            <PasswordInput
              label="Password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={errors.password?.message}
              {...register("password")}
            />
            <PasswordStrength password={watchedPassword || ""} />
          </div>

          <div className="space-y-1.5">
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            {watchedConfirm && !errors.confirmPassword && (
              <div className="flex items-center gap-1.5 text-xs text-[#10B981]">
                <Check className="h-3.5 w-3.5" />
                {passwordsMatch
                  ? "Passwords match"
                  : "Retype your password"}
              </div>
            )}
          </div>

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
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <AuthDivider />
        </div>

        <div className="mt-6">
          <GoogleLoginButton text="signup_with" />
        </div>
      </AuthCard>

      <p className="text-center text-sm text-[#71717A]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#4F46E5] hover:text-[#6366F1] transition-colors underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
