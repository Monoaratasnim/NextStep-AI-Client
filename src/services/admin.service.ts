import api from "./api";
import type { BackendResponse } from "@/types/auth";

export interface AdminStats {
  totalUsers: number;
  totalCareers: number;
  totalIndustries: number;
  averageRating: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } =
      await api.get<BackendResponse<AdminStats>>("/admin/stats");

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load admin stats.");
    }

    return data.data;
  },
};
