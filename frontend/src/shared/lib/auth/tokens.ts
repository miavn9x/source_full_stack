export function isTokenExpiring(
  token: string | undefined,
  skewSeconds = 30,
): boolean {
  if (!token) return true;

  const parts = token.split(".");
  if (parts.length !== 3) return true;

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { exp?: unknown };

    if (typeof payload.exp !== "number") return true;
    return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
  } catch {
    return true;
  }
}
