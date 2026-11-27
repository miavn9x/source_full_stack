export interface DecodedJwt {
  sub?: string;
  email?: string;
  roles?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload =
      typeof atob !== "undefined"
        ? decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join(""),
          )
        : Buffer.from(base64, "base64").toString("utf8");

    return JSON.parse(jsonPayload) as DecodedJwt;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string, skewSeconds: number = 30): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now + skewSeconds;
}
