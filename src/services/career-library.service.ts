import api from "./api";
import type { BackendResponse } from "@/types/auth";
import type {
  ICareerLibrary,
  CreateCareerLibraryPayload,
  UpdateCareerLibraryPayload,
  CareerLibraryQueryParams,
  PaginatedCareersResult,
} from "@/types/career-library";

export interface PublicStats {
  totalCareers: number;
  totalIndustries: number;
  totalRoadmaps: number;
  totalRecommendations: number;
}

export interface IndustryDistribution {
  industry: string;
  count: number;
}

export const careerLibraryService = {
  async getAll(): Promise<ICareerLibrary[]> {
    const { data } =
      await api.get<BackendResponse<ICareerLibrary[]>>("/career-library");

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load careers.");
    }

    return data.data;
  },

  async search(
    params: CareerLibraryQueryParams
  ): Promise<PaginatedCareersResult> {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search);
    if (params.industry) query.set("industry", params.industry);
    if (params.experienceLevel)
      query.set("experienceLevel", params.experienceLevel);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const { data } = await api.get<BackendResponse<PaginatedCareersResult>>(
      `/career-library/search${qs ? `?${qs}` : ""}`
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load careers.");
    }

    return data.data;
  },

  async getById(id: string): Promise<ICareerLibrary> {
    const { data } = await api.get<BackendResponse<ICareerLibrary>>(
      `/career-library/${id}`
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Career not found.");
    }

    return data.data;
  },

  async create(
    payload: CreateCareerLibraryPayload
  ): Promise<ICareerLibrary> {
    const { data } = await api.post<BackendResponse<ICareerLibrary>>(
      "/career-library",
      payload
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to create career.");
    }

    return data.data;
  },

  async update(
    id: string,
    payload: UpdateCareerLibraryPayload
  ): Promise<ICareerLibrary> {
    const { data } = await api.patch<BackendResponse<ICareerLibrary>>(
      `/career-library/${id}`,
      payload
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to update career.");
    }

    return data.data;
  },

  async delete(id: string): Promise<void> {
    const { data } = await api.delete<BackendResponse<null>>(
      `/career-library/${id}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to delete career.");
    }
  },

  async getPublicStats(): Promise<PublicStats> {
    const { data } = await api.get<BackendResponse<PublicStats>>(
      "/career-library/public-stats"
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load public stats.");
    }

    return data.data;
  },

  async getIndustryDistribution(): Promise<IndustryDistribution[]> {
    const { data } = await api.get<BackendResponse<IndustryDistribution[]>>(
      "/career-library/distribution"
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load industry distribution.");
    }

    return data.data;
  },
};
