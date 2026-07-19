import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { aiService } from "@/services/ai.service";
import type {
  RoadmapPayload,
  RecommendationPayload,
} from "@/types/ai";

export function useMyRoadmap() {
  const { user } = useAuth();
  const userId = user?._id;

  return useQuery({
    queryKey: ["ai", "roadmap", userId],
    queryFn: aiService.getMyRoadmap,
    retry: false,
    enabled: !!userId,
  });
}

export function useGenerateRoadmap() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id;

  return useMutation({
    mutationFn: (payload: RoadmapPayload) =>
      aiService.generateRoadmap(payload),
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(["ai", "roadmap", userId], data);
      }
    },
  });
}

export function useMyRecommendation() {
  const { user } = useAuth();
  const userId = user?._id;

  return useQuery({
    queryKey: ["ai", "recommendation", userId],
    queryFn: aiService.getMyRecommendation,
    retry: false,
    enabled: !!userId,
  });
}

export function useGenerateRecommendation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?._id;

  return useMutation({
    mutationFn: (payload: RecommendationPayload) =>
      aiService.generateRecommendation(payload),
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(
          ["ai", "recommendation", userId],
          data
        );
      }
    },
  });
}
