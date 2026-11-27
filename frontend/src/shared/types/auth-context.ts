import type { SessionUser } from "../lib/auth/constants";

export interface AuthState {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
