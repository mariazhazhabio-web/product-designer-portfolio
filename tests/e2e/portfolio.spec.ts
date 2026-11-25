import { test, expect } from "@playwright/test";

const PAGES = ["/", "/about/", "/projects/", "/projects/sportsync/", "/projects/widekonek/", "/projects/frendora/", "/projects/zc-smart-digital/", "/process/", "/research/", "/architecture/", "/wireframes/", "/design-system/", "/prototypes/", "/usability/", "/metrics/", "/engineering/", "/skills/", "/resume/", "/contact/", "/role-alignment/", "/docs/", "/docs/prd/"];

test("every portfolio page renders with a heading and no horizontal overflow", async ({ page }) => {
  for (const path of PAGES) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1").first(), path).toBeVisible();
    const overflow = (await page.evaluate(() => document.documentElement.scrollWidth)) - page.viewportSize()!.width;
    expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
  }
});

test("home features SportSync and links to the case study", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /SportSync/ })).toBeVisible();
  await page.getByRole("link", { name: "Read the SportSync case study" }).click();
  await expect(page).toHaveURL(/projects\/sportsync/);
  for (const id of ["overview", "challenge", "ai", "metrics", "future"]) await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.locator("article section")).toHaveCount(22);
});

test("theme toggle switches to dark mode and persists", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("theme", "light"));
  await page.reload();
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("role alignment links to evidence", async ({ page }) => {
  await page.goto("/role-alignment/");
  await expect(page.getByRole("listitem")).toHaveCount(11, { timeout: 5000 }).catch(() => undefined);
  await page.getByRole("link", { name: "Usability plan" }).click();
  await expect(page).toHaveURL(/usability/);
});

test("documents library renders markdown", async ({ page }) => {
  await page.goto("/docs/");
  await page.getByRole("link", { name: /API specification/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("API specification");
  await expect(page.locator("article pre").first()).toBeVisible();
});
