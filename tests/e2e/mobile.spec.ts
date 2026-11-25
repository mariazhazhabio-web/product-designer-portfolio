import { test, expect } from "@playwright/test";

const ROUTES = [
  "/", "/about/", "/projects/", "/projects/sportsync/", "/projects/widekonek/", "/projects/frendora/", "/projects/zc-smart-digital/", "/process/", "/research/", "/architecture/", "/wireframes/", "/design-system/", "/prototypes/", "/usability/", "/metrics/", "/engineering/", "/skills/", "/resume/", "/contact/", "/role-alignment/", "/docs/", "/docs/api-spec/",
  "/demo/", "/demo/calendar/", "/demo/assistant/", "/demo/conflicts/", "/demo/attendance/", "/demo/teams/", "/demo/venues/", "/demo/schedule-tools/", "/demo/sync/", "/demo/notifications/", "/demo/settings/", "/demo/onboarding/", "/demo/states/", "/demo/share/?team=t-hawks",
];

test("mobile: every page fits the screen (no horizontal scroll)", async ({ page }) => {
  test.setTimeout(120_000);
  for (const path of ROUTES) {
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
    const overflow = (await page.evaluate(() => document.documentElement.scrollWidth)) - page.viewportSize()!.width;
    expect.soft(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
  }
});

test("mobile: demo uses bottom navigation and the More sheet", async ({ page }) => {
  await page.goto("/demo/");
  const nav = page.getByRole("navigation", { name: "SportSync mobile navigation" });
  await expect(nav).toBeVisible();
  await nav.getByRole("button", { name: "More" }).click();
  await expect(page.getByRole("dialog", { name: "All SportSync screens" })).toBeVisible();
});

test("mobile: calendar defaults to list view", async ({ page }) => {
  await page.goto("/demo/calendar/");
  await expect(page.getByRole("tab", { name: "List" })).toHaveAttribute("aria-selected", "true");
});
