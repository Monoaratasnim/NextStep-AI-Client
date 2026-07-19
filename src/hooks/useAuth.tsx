"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { getToken, setToken, removeToken } from "@/utils/token";
import { DEFAULT_LOGIN_REDIRECT, DEFAULT_LOGOUT_REDIRECT } from "@/constants";
import type { User, LoginPayload, RegisterPayload } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload, redirectTo?: string) => Promise<void>;
  googleLogin: (credential: string, redirectTo?: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!getToken();
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const login = useCallback(
    async (payload: LoginPayload, redirectTo?: string) => {
      const res = await authService.login(payload);
      setToken(res.token);
      setUser(res.user);
      router.push(redirectTo || DEFAULT_LOGIN_REDIRECT);
    },
    [router]
  );

  const googleLogin = useCallback(
    async (credential: string, redirectTo?: string) => {
      const res = await authService.googleLogin(credential);
      setToken(res.token);
      setUser(res.user);
      router.push(redirectTo || DEFAULT_LOGIN_REDIRECT);
    },
    [router]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authService.register(payload);
    },
    []
  );

  const logout = useCallback(() => {
    queryClient.clear();
    removeToken();
    setUser(null);
    router.push(DEFAULT_LOGOUT_REDIRECT);
  }, [queryClient, router]);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      return;
    }

    authService
      .getProfile()
      .then((profile) => setUser(profile))
      .catch(() => removeToken())
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, googleLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
