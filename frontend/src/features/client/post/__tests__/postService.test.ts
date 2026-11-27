import { describe, it, expect } from "vitest";
import { postService, fetchPublishedPages, fetchPublishedPage } from "../services/postService";

describe("Post Feature Service", () => {
  it("fetches published pages gracefully when offline or mock", async () => {
    const pages = await fetchPublishedPages();
    expect(Array.isArray(pages)).toBe(true);
  });

  it("fetches single published page gracefully", async () => {
    const page = await fetchPublishedPage("test-page");
    // Should return null gracefully if backend is offline during test
    expect(page === null || typeof page === "object").toBe(true);
  });

  it("exports postService methods", () => {
    expect(typeof postService.fetchPublishedPages).toBe("function");
    expect(typeof postService.fetchPublishedPage).toBe("function");
  });
});
