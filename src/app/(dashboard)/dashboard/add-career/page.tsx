"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Loader2, PlusCircle, ArrowLeft } from "lucide-react";
import { useCreateCareer } from "@/hooks/useCareerLibrary";
import FormField from "@/components/shared/FormField";
import SelectField from "@/components/shared/SelectField";
import TagInput from "@/components/shared/TagInput";
import Button from "@/components/shared/Button";

const careerSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters"),
  image: z.string().optional(),
  industry: z
    .string()
    .min(2, "Industry must be at least 2 characters"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  salaryBangladesh: z.string().optional(),
  salaryInternational: z.string().optional(),
  rating: z
    .number()
    .min(0, "Minimum rating is 0")
    .max(5, "Maximum rating is 5")
    .optional(),
  skills: z
    .array(z.string())
    .min(1, "Add at least one skill"),
  responsibilities: z
    .array(z.string())
    .min(1, "Add at least one responsibility"),
  jobOutlook: z.string().optional(),
});

type CareerValues = z.infer<typeof careerSchema>;

const experienceOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export default function AddCareerPage() {
  const router = useRouter();
  const createMutation = useCreateCareer();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CareerValues>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      title: "",
      image: "",
      industry: "",
      experienceLevel: "Beginner",
      shortDescription: "",
      description: "",
      salaryBangladesh: "",
      salaryInternational: "",
      rating: undefined,
      skills: [],
      responsibilities: [],
      jobOutlook: "",
    },
  });

  const watchedSkills = watch("skills");
  const watchedResponsibilities = watch("responsibilities");

  const onSubmit = (data: CareerValues) => {
    setServerError(null);
    const { salaryBangladesh, salaryInternational, ...rest } = data;
    const payload = {
      ...rest,
      salary: {
        bangladesh: salaryBangladesh || "",
        international: salaryInternational || "",
      },
    };
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Career created successfully");
        router.push("/dashboard/manage-careers");
      },
      onError: (error: Error) => {
        setServerError(error.message);
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Add Career
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Create a new career entry in the library.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {serverError && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 text-sm text-rose-300">
            {serverError}
          </div>
        )}

        {/* Basic Info */}
        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717A]">
            Basic Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title"
              placeholder="e.g. Frontend Developer"
              error={errors.title?.message}
              {...register("title")}
            />
            <FormField
              label="Industry"
              placeholder="e.g. Technology"
              error={errors.industry?.message}
              {...register("industry")}
            />
            <SelectField
              label="Experience Level"
              options={experienceOptions}
              error={errors.experienceLevel?.message}
              {...register("experienceLevel")}
            />
            <FormField
              label="Bangladesh Salary"
              placeholder="e.g. ৳40,000 - ৳150,000/month"
              error={errors.salaryBangladesh?.message}
              {...register("salaryBangladesh")}
            />
            <FormField
              label="International Opportunity"
              placeholder="e.g. $50,000 - $120,000/year"
              error={errors.salaryInternational?.message}
              {...register("salaryInternational")}
            />
            <FormField
              label="Image URL"
              placeholder="https://example.com/image.jpg"
              error={errors.image?.message}
              {...register("image")}
              className="sm:col-span-2"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717A]">
            Descriptions
          </h2>
          <div className="space-y-4">
            <FormField
              label="Short Description"
              placeholder="A brief one-line summary of this career"
              error={errors.shortDescription?.message}
              {...register("shortDescription")}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#A1A1AA]">
                Full Description
              </label>
              <textarea
                rows={5}
                placeholder="Detailed description of this career path, what it involves, and who it's for..."
                className={`w-full rounded-xl border bg-[#0A0A0A] px-4 py-2.5 text-sm text-white placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-200 resize-none ${
                  errors.description
                    ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-[#27272A] focus:border-[#4F46E5] focus:ring-[#4F46E5]/20"
                }`}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-rose-400">
                  {errors.description.message}
                </p>
              )}
            </div>
            <FormField
              label="Job Outlook"
              placeholder="e.g. Growing rapidly, high demand"
              error={errors.jobOutlook?.message}
              {...register("jobOutlook")}
            />
          </div>
        </div>

        {/* Skills & Responsibilities */}
        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717A]">
            Skills & Responsibilities
          </h2>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TagInput
                label="Skills"
                tags={watchedSkills}
                onChange={(val) => setValue("skills", val, { shouldValidate: true })}
                placeholder="Type a skill and press Enter"
                error={errors.skills?.message}
              />
              <TagInput
                label="Responsibilities"
                tags={watchedResponsibilities}
                onChange={(val) =>
                  setValue("responsibilities", val, { shouldValidate: true })
                }
                placeholder="Type a responsibility and press Enter"
                error={errors.responsibilities?.message}
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="rounded-2xl border border-[#27272A] bg-[#111111] p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#71717A]">
            Rating
          </h2>
          <div className="max-w-xs">
            <FormField
              label="Rating (0-5)"
              type="number"
              step="0.1"
              min={0}
              max={5}
              placeholder="e.g. 4.5"
              error={errors.rating?.message}
              {...register("rating", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="gap-1.5"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                Create Career
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
