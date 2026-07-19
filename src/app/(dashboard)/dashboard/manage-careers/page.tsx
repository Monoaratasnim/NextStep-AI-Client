"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Pencil,
  Trash2,
  X,
  Users,
  Plus,
  Star,
} from "lucide-react";
import {
  useCareers,
  useDeleteCareer,
  useUpdateCareer,
} from "@/hooks/useCareerLibrary";
import { EmptyState, SkeletonBlock } from "@/components/shared/Loading";
import FormField from "@/components/shared/FormField";
import SelectField from "@/components/shared/SelectField";
import TagInput from "@/components/shared/TagInput";
import Button from "@/components/shared/Button";
import type { ICareerLibrary } from "@/types/career-library";

const editSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  image: z.string().optional(),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  shortDescription: z
    .string()
    .min(10, "Short description must be at least 10 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  salaryBangladesh: z.string().optional(),
  salaryInternational: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  responsibilities: z
    .array(z.string())
    .min(1, "Add at least one responsibility"),
  jobOutlook: z.string().optional(),
});

type EditValues = z.infer<typeof editSchema>;

const experienceOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export default function ManageCareersPage() {
  const { data: careers, isLoading, error } = useCareers();
  const deleteMutation = useDeleteCareer();
  const updateMutation = useUpdateCareer();
  const [editingCareer, setEditingCareer] = useState<ICareerLibrary | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Career deleted successfully");
        setDeleteConfirm(null);
      },
      onError: (error: Error) => {
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
            Manage Careers
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            View, edit, and manage all career profiles in the library.
          </p>
        </div>
        <a href="/dashboard/add-career">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Career
          </Button>
        </a>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-950/20 p-6">
          <span className="text-sm text-rose-300">
            {error.message}
          </span>
        </div>
      ) : !careers || careers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No careers yet"
          description="Add your first career to the library to get started."
          action={
            <a href="/dashboard/add-career">
              <Button variant="primary" size="md" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Career
              </Button>
            </a>
          }
        />
      ) : (
        <div className="space-y-3">
          {careers.map((career) => (
            <div
              key={career._id}
              className="rounded-2xl border border-[#27272A] bg-[#111111] p-5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">
                      {career.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#27272A]/50 px-2 py-0.5 text-xs font-medium text-[#A1A1AA]">
                      {career.industry}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#27272A]/50 px-2 py-0.5 text-xs font-medium text-[#A1A1AA]">
                      {career.experienceLevel}
                    </span>
                    {career.rating > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {career.rating}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#A1A1AA] line-clamp-2">
                    {career.shortDescription}
                  </p>
                  {career.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {career.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex rounded-md bg-[#4F46E5]/10 px-2 py-0.5 text-3xs font-medium text-[#4F46E5]"
                        >
                          {skill}
                        </span>
                      ))}
                      {career.skills.length > 5 && (
                        <span className="inline-flex rounded-md bg-[#27272A]/50 px-2 py-0.5 text-3xs font-medium text-[#71717A]">
                          +{career.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingCareer(career)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] transition-colors"
                    aria-label="Edit career"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {deleteConfirm === career._id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(career._id)}
                        disabled={deleteMutation.isPending}
                        className="flex h-8 items-center gap-1 rounded-lg bg-rose-600 px-2.5 text-xs font-medium text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Confirm"
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] hover:bg-[#27272A]/50 hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(career._id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                      aria-label="Delete career"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingCareer && (
        <EditModal
          career={editingCareer}
          onClose={() => setEditingCareer(null)}
          onSave={(id, data) => {
            const { salaryBangladesh, salaryInternational, ...rest } = data;
            const payload = {
              ...rest,
              salary: {
                bangladesh: salaryBangladesh || "",
                international: salaryInternational || "",
              },
            };
            updateMutation.mutate(
              { id, payload },
              {
                onSuccess: () => {
                  toast.success("Career updated successfully");
                  setEditingCareer(null);
                },
                onError: (error: Error) => {
                  toast.error(error.message);
                },
              }
            );
          }}
          isPending={updateMutation.isPending}
        />
      )}
    </div>
  );
}

function EditModal({
  career,
  onClose,
  onSave,
  isPending,
}: {
  career: ICareerLibrary;
  onClose: () => void;
  onSave: (id: string, payload: EditValues) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: career.title,
      image: career.image || "",
      industry: career.industry,
      experienceLevel: career.experienceLevel,
      shortDescription: career.shortDescription,
      description: career.description,
      salaryBangladesh: career.salary?.bangladesh || "",
      salaryInternational: career.salary?.international || "",
      rating: career.rating || undefined,
      skills: career.skills,
      responsibilities: career.responsibilities,
      jobOutlook: career.jobOutlook || "",
    },
  });

  const watchedSkills = watch("skills");
  const watchedResponsibilities = watch("responsibilities");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-[5vh] pb-[5vh]">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#27272A] bg-[#111111] p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            Edit Career
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] hover:bg-[#27272A]/50 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((data) => onSave(career._id, data))}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title"
              error={errors.title?.message}
              {...register("title")}
            />
            <FormField
              label="Industry"
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
              label="Rating (0-5)"
              type="number"
              step="0.1"
              min={0}
              max={5}
              error={errors.rating?.message}
              {...register("rating", { valueAsNumber: true })}
            />
            <FormField
              label="Image URL"
              error={errors.image?.message}
              {...register("image")}
            />
          </div>

          <FormField
            label="Short Description"
            error={errors.shortDescription?.message}
            {...register("shortDescription")}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#A1A1AA]">
              Full Description
            </label>
            <textarea
              rows={4}
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
            error={errors.jobOutlook?.message}
            {...register("jobOutlook")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TagInput
              label="Skills"
              tags={watchedSkills}
              onChange={(val) =>
                setValue("skills", val, { shouldValidate: true })
              }
              error={errors.skills?.message}
            />
            <TagInput
              label="Responsibilities"
              tags={watchedResponsibilities}
              onChange={(val) =>
                setValue("responsibilities", val, { shouldValidate: true })
              }
              error={errors.responsibilities?.message}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
