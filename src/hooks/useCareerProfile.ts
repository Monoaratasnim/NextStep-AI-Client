import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { careerService } from "@/services/career.service";
import type { CreateCareerPayload, UpdateCareerPayload } from "@/types/career";

export function useCareerProfile(enabled = true) {
  const { user } = useAuth();
  const userId = user?._id;

  return useQuery({
    queryKey: ["career", "profile", userId],
    queryFn: careerService.getProfile,
    retry: false,
    enabled: enabled && !!userId,
  });
}

export function useCreateCareerProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id;

  return useMutation({
    mutationFn: (payload: CreateCareerPayload) =>
      careerService.createProfile(payload),
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(["career", "profile", userId], data);
      }
    },
  });
}

export function useUpdateCareerProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id;

  return useMutation({
    mutationFn: (payload: UpdateCareerPayload) =>
      careerService.updateProfile(payload),
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(["career", "profile", userId], data);
      }
    },
  });
}
