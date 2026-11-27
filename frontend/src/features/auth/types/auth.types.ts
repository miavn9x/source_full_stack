export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthSession {
  id: string;
  email: string;
  name?: string | null;
  roles?: string[];
}
