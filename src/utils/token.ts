import { TOKEN_KEY } from "@/constants";

/**
 * Token storage adapter.
 *
 * Current: reads a cookie set by the frontend (accessible via document.cookie).
 * Future:  the backend will set an httpOnly cookie on login/register.
 *          Once that's in place, remove setToken() — getToken() will still
 *          work because the browser sends httpOnly cookies automatically.
 */
export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=2592000; same-site=lax`;
}

export function removeToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}
