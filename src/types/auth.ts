export interface User {
  _id: string;
  fullName: string;
  email: string;
  photo?: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface BackendResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  user: User;
  token: string;
}

export type AuthResponse = BackendResponse<AuthData>;
