"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Pencil,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Target,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  useCareerProfile,
  useCreateCareerProfile,
  useUpdateCareerProfile,
} from "@/hooks/useCareerProfile";
import { useNotifications } from "@/contexts/NotificationContext";
import FormField from "@/components/shared/FormField";
import SelectField from "@/components/shared/SelectField";
import TagInput from "@/components/shared/TagInput";
import Button from "@/components/shared/Button";

const careerSchema = z.object({
  careerGoal: z
    .string()
    .min(3, "Career goal must be at least 3 characters"),
  currentRole: z.string().optional(),
  education: z.string().optional(),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  skills: z
    .array(z.string())
    .min(1, "Add at least one skill"),
  interests: z
    .array(z.string())
    .min(1, "Add at least one interest"),
  preferredIndustry: z.string().optional(),
});

type CareerValues = z.infer<typeof careerSchema>;

const experienceOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export default function CareerProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#71717A]" />
          <p className="mt-4 text-sm text-[#A1A1AA]">
            Loading career profile...
          </p>
        </div>
      }
    >
      <CareerProfileForm />
    </Suspense>
  );
}

function CareerProfileForm() {
  const searchParams = useSearchParams();

  const prefilledCareerGoal = searchParams.get("careerGoal") || "";
  const prefilledIndustry = searchParams.get("preferredIndustry") || "";
  const prefilledExperienceLevel = searchParams.get("experienceLevel") || "";
  const prefilledSkills = searchParams.get("skills") || "";

  const hasPrefill =
    prefilledCareerGoal || prefilledIndustry || prefilledExperienceLevel || prefilledSkills;

  const { data: profile, isLoading, error } = useCareerProfile();
  const createMutation = useCreateCareerProfile();
  const updateMutation = useUpdateCareerProfile();
  const { addNotification } = useNotifications();

  const isNotFound =
    error?.message === "Career profile not found";
  const [mode, setMode] = useState<"view" | "edit" | "create">(
    isNotFound ? "create" : "view"
  );

  useEffect(() => {
    if (isNotFound) setMode("create");
    else if (profile) setMode("view");
  }, [profile, isNotFound]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CareerValues>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      careerGoal: prefilledCareerGoal,
      currentRole: "",
      education: "",
      experienceLevel: (prefilledExperienceLevel as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
      skills: prefilledSkills ? prefilledSkills.split(",").filter(Boolean) : [],
      interests: [],
      preferredIndustry: prefilledIndustry,
    },
  });

  const watchedSkills = watch("skills");
  const watchedInterests = watch("interests");

  useEffect(() => {
    if (profile && mode === "view") {
      reset({
        careerGoal: profile.careerGoal,
        currentRole: profile.currentRole || "",
        education: profile.education || "",
        experienceLevel: profile.experienceLevel,
        skills: profile.skills,
        interests: profile.interests,
        preferredIndustry: profile.preferredIndustry || "",
      });
    }
  }, [profile, mode, reset]);

  const startEdit = () => {
    if (profile) {
      reset({
        careerGoal: profile.careerGoal,
        currentRole: profile.currentRole || "",
        education: profile.education || "",
        experienceLevel: profile.experienceLevel,
        skills: profile.skills,
        interests: profile.interests,
        preferredIndustry: profile.preferredIndustry || "",
      });
    }
    setMode("edit");
  };

  const cancelEdit = () => {
    if (profile) {
      reset({
        careerGoal: profile.careerGoal,
        currentRole: profile.currentRole || "",
        education: profile.education || "",
        experienceLevel: profile.experienceLevel,
        skills: profile.skills,
        interests: profile.interests,
        preferredIndustry: profile.preferredIndustry || "",
      });
    }
    setMode(profile ? "view" : "create");
  };

  const onSubmit = async (values: CareerValues) => {
    const payload = {
      ...values,
      currentRole: values.currentRole || undefined,
      education: values.education || undefined,
      preferredIndustry: values.preferredIndustry || undefined,
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
        toast.success("Career profile created!");
        addNotification({
          type: "profile",
          title: "Profile Created",
          description: "Your career profile has been created successfully.",
        });
        setMode("view");
      } else {
        await updateMutation.mutateAsync(payload);
        toast.success("Career profile updated!");
        setMode("view");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";
      toast.error(message);
    }
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#71717A]" />
        <p className="mt-4 text-sm text-[#A1A1AA]">
          Loading career profile...
        </p>
      </div>
    );
  }

  if (error && !isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/30">
          <AlertCircle className="h-7 w-7 text-rose-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">
          Something went wrong
        </h3>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          {error.message}
        </p>
      </div>
    );
  }

  if (mode === "view" && profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Career Profile
            </h2>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              Your career goals, skills, and preferences.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={startEdit}
            className="gap-1.5"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={Target}
            label="Career Goal"
            value={profile.careerGoal}
          />
          <InfoCard
            icon={Briefcase}
            label="Current Role"
            value={profile.currentRole || "Not specified"}
          />
          <InfoCard
            icon={GraduationCap}
            label="Education"
            value={profile.education || "Not specified"}
          />
          <InfoCard
            icon={Sparkles}
            label="Experience Level"
            value={profile.experienceLevel}
          />
        </div>

        {profile.preferredIndustry && (
          <InfoCard
            icon={Briefcase}
            label="Preferred Industry"
            value={profile.preferredIndustry}
            fullWidth
          />
        )}

        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex rounded-lg bg-[#4F46E5]/10 px-3 py-1.5 text-xs font-medium text-[#4F46E5]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#71717A]">
                No skills added yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex rounded-lg bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#10B981]"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#71717A]">
                No interests added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === "create"
              ? "Create Career Profile"
              : "Edit Career Profile"}
          </h2>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Tell us about your career goals and skills.
          </p>
        </div>
        {mode === "edit" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={cancelEdit}
            className="gap-1.5"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>

      {hasPrefill && mode === "create" && (
        <div className="rounded-2xl border border-[#4F46E5]/20 bg-[#4F46E5]/10 p-4 text-sm text-[#4F46E5]">
          Some fields have been prefilled from the Career Library. Review and
          complete the rest before submitting.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl border border-[#27272A] bg-[#111111] p-6 sm:p-8"
      >
        <FormField
          label="Career Goal"
          placeholder="e.g. Become a Senior Full-Stack Developer"
          disabled={isPending}
          error={errors.careerGoal?.message}
          {...register("careerGoal")}
        />

        <FormField
          label="Current Role"
          placeholder="e.g. Junior Frontend Developer"
          disabled={isPending}
          error={errors.currentRole?.message}
          {...register("currentRole")}
        />

        <FormField
          label="Education"
          placeholder="e.g. B.S. Computer Science"
          disabled={isPending}
          error={errors.education?.message}
          {...register("education")}
        />

        <SelectField
          label="Experience Level"
          options={experienceOptions}
          disabled={isPending}
          error={errors.experienceLevel?.message}
          {...register("experienceLevel")}
        />

        <TagInput
          label="Skills"
          tags={watchedSkills}
          onChange={(val) => setValue("skills", val, { shouldValidate: true })}
          placeholder="e.g. React, Node.js, TypeScript"
          error={errors.skills?.message}
          disabled={isPending}
        />

        <TagInput
          label="Interests"
          tags={watchedInterests}
          onChange={(val) =>
            setValue("interests", val, { shouldValidate: true })
          }
          placeholder="e.g. AI/ML, Cloud Architecture"
          error={errors.interests?.message}
          disabled={isPending}
        />

        <FormField
          label="Preferred Industry"
          placeholder="e.g. FinTech, Healthcare Tech"
          disabled={isPending}
          error={errors.preferredIndustry?.message}
          {...register("preferredIndustry")}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {mode === "create"
                  ? "Create Profile"
                  : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#27272A] bg-[#111111] p-5 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[#71717A]" />
        <span className="text-xs font-medium uppercase tracking-wider text-[#71717A]">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-white">
        {value}
      </p>
    </div>
  );
}
