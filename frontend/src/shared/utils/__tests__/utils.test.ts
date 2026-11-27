import { describe, it, expect } from "vitest";
import { toSlug } from "../slug";
import { formatCurrency } from "../format-currency";
import { isValidEmail } from "../validation";

describe("Shared Utils", () => {
  it("converts Vietnamese string to clean slug", () => {
    expect(toSlug("Áo thun Nam Đẹp 2026")).toBe("ao-thun-nam-dep-2026");
    expect(toSlug("   Sản phẩm & Khuyến Mãi   ")).toBe("san-pham-khuyen-mai");
  });

  it("formats VND currency", () => {
    expect(formatCurrency(199000, "VND")).toContain("199.000");
  });

  it("validates emails properly", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
  });
});
