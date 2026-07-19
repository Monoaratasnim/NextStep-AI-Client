import api from "./api";
import type { BackendResponse } from "@/types/auth";
import type {
  RoadmapPayload,
  RecommendationPayload,
  SavedRoadmap,
  SavedRecommendation,
} from "@/types/ai";

export const aiService = {
  async generateRoadmap(payload: RoadmapPayload): Promise<SavedRoadmap> {
    const { data } = await api.post<BackendResponse<SavedRoadmap>>(
      "/ai/roadmap",
      payload
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to generate roadmap.");
    }

    return data.data;
  },

  async getMyRoadmap(): Promise<SavedRoadmap> {
    const { data } = await api.get<BackendResponse<SavedRoadmap>>(
      "/ai/roadmap/me"
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "No roadmap found.");
    }

    return data.data;
  },

  async generateRecommendation(
    payload: RecommendationPayload
  ): Promise<SavedRecommendation> {
    const { data } = await api.post<BackendResponse<SavedRecommendation>>(
      "/ai/recommend",
      payload
    );

    if (!data.success || !data.data) {
      throw new Error(
        data.message || "Failed to generate recommendation."
      );
    }

    return data.data;
  },

  async getMyRecommendation(): Promise<SavedRecommendation> {
    const { data } = await api.get<BackendResponse<SavedRecommendation>>(
      "/ai/recommend/me"
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "No recommendation found.");
    }

    return data.data;
  },
};
