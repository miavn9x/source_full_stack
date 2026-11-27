import type { LoginCredentials, AuthSession } from "../types/auth.types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Đăng nhập không thành công.");
    }

    return (await res.json()) as AuthSession;
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  },

  async getSession(): Promise<AuthSession | null> {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as AuthSession;
    } catch {
      return null;
    }
  },
};
