import api from "./api";
import type { AuthData, BackendResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthData> {
    const { data } = await api.post<BackendResponse<AuthData>>("/auth/login", payload);

    if (!data.success || !data.data) {
      throw new Error(data.message || "Login failed.");
    }

    return data.data;
  },

  async googleLogin(credential: string): Promise<AuthData> {
    const { data } = await api.post<BackendResponse<AuthData>>("/auth/google", { credential });

    if (!data.success || !data.data) {
      throw new Error(data.message || "Google login failed.");
    }

    return data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthData> {
    const { data } = await api.post<BackendResponse<AuthData>>("/auth/register", payload);

    if (!data.success || !data.data) {
      throw new Error(data.message || "Registration failed.");
    }

    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<BackendResponse<User>>("/auth/profile");

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to load profile.");
    }

    return data.data;
  },
};
