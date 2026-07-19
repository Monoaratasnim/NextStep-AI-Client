import api from "./api";
import type { BackendResponse } from "@/types/auth";
import type {
  ICareer,
  CreateCareerPayload,
  UpdateCareerPayload,
} from "@/types/career";

export const careerService = {
  async getProfile(): Promise<ICareer> {
    const { data } =
      await api.get<BackendResponse<ICareer>>("/career/me");

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load career profile.");
    }

    return data.data;
  },

  async createProfile(payload: CreateCareerPayload): Promise<ICareer> {
    const { data } = await api.post<BackendResponse<ICareer>>(
      "/career",
      payload
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to create career profile.");
    }

    return data.data;
  },

  async updateProfile(
    payload: UpdateCareerPayload
  ): Promise<ICareer> {
    const { data } = await api.patch<BackendResponse<ICareer>>(
      "/career",
      payload
    );

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to update career profile.");
    }

    return data.data;
  },
};
