import { expect, test } from "@playwright/test";

test("home page renders plasmic client visual renderer", async ({ page }) => {
  await page.goto("/");
  // When Plasmic is not yet connected with API key in test environment, it displays the studio placeholder
  await expect(
    page.getByRole("heading", { name: "Plasmic chưa được cấu hình" }),
  ).toBeVisible();
});

test("admin crm portal is accessible directly without login", async ({ page }) => {
  await page.goto("/admin");
  // Confirms admin dashboard is directly accessible without redirection to login
  await expect(page).toHaveURL(/\/admin/);
  await expect(page.getByText("CRM Admin")).toBeVisible();
});

test("dynamic visual page route renders fallback", async ({ page }) => {
  await page.goto("/landing");
  await expect(
    page.getByRole("heading", { name: "Plasmic chưa được cấu hình" }),
  ).toBeVisible();
});
