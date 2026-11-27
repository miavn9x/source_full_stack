import { describe, it, expect } from "vitest";
import { decodeJwt, isJwtExpired } from "../jwt";

describe("JWT Helper", () => {
  it("decodes payload correctly", () => {
    // Header: {"alg":"none"}, Payload: {"sub":"user123","email":"admin@example.com","exp":9999999999}
    const token =
      "eyJhbGciOiJub25lIn0.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.";
    const decoded = decodeJwt(token);
    expect(decoded?.sub).toBe("user123");
    expect(decoded?.email).toBe("admin@example.com");
    expect(isJwtExpired(token)).toBe(false);
  });

  it("returns null for malformed token", () => {
    expect(decodeJwt("invalid-token")).toBeNull();
    expect(isJwtExpired("invalid-token")).toBe(true);
  });
});
