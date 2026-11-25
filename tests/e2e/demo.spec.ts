import { test, expect, type Page } from "@playwright/test";

async function openDemo(page: Page, path = "/demo/") {
  await page.goto(path);
  await expect(page.locator("main [aria-busy=true]")).toHaveCount(0);
}
const blockingCount = async (page: Page) => Number((await page.getByRole("tab", { name: /Blocking/ }).textContent())?.replace(/\D/g, ""));

test("dashboard shows stats and alerts", async ({ page }) => {
  await openDemo(page);
  await expect(page.getByRole("heading", { name: /Good (morning|afternoon|evening), Alex/ })).toBeVisible();
  await expect(page.getByText("Open scheduling conflicts")).toBeVisible();
  await expect(page.getByText("Scheduling alerts")).toBeVisible();
});

test("create event: validation, live conflict, save", async ({ page }) => {
  await openDemo(page, "/demo/calendar/");
  await page.getByRole("button", { name: "Create event" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Create event" });
  await dialog.getByRole("button", { name: "Create event" }).click();
  await expect(dialog.getByText("Give the event a name")).toBeVisible();
  await expect(dialog.getByText("Choose a venue.")).toBeVisible();
  await dialog.getByLabel("Event name").fill("E2E shooting session");
  await dialog.getByLabel("Venue").selectOption("v-cb");
  await expect(dialog.getByText(/double-booked|No conflicts found/).first()).toBeVisible();
  await dialog.getByRole("button", { name: "Create event" }).click();
  await expect(page.getByText("Event created")).toBeVisible();
});

test("resolve a conflict by comparing alternatives", async ({ page }) => {
  await openDemo(page, "/demo/conflicts/");
  const before = await blockingCount(page);
  const card = page.locator("li", { hasText: "Court A double-booked" }).first();
  await card.getByRole("button", { name: "Compare alternatives" }).click();
  const dlg = page.getByRole("dialog", { name: "Compare alternatives" });
  await dlg.getByRole("radio").first().click();
  await dlg.getByRole("button", { name: "Review change" }).click();
  await page.getByRole("button", { name: "Confirm and notify" }).click();
  await expect(page.getByText("Event rescheduled")).toBeVisible();
  await expect.poll(() => blockingCount(page)).toBeLessThan(before);
});

test("AI assistant: generate, approve and undo", async ({ page }) => {
  await openDemo(page, "/demo/assistant/");
  await expect(page.getByText("Simulated AI: rule-based engine")).toBeVisible();
  await page.getByRole("button", { name: "Generate proposal" }).click();
  await expect(page.getByText("What I understood")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(/pool play \+ playoffs/)).toBeVisible();
  await page.getByRole("button", { name: /Approve & publish 24 events/ }).click();
  await expect(page.getByText("Published to the calendar").first()).toBeVisible();
  await page.getByRole("status").filter({ hasText: "Published to the calendar" }).getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText(/Undid: Approved assistant schedule/)).toBeVisible();
});

test("parent can RSVP per child and cannot create events", async ({ page }) => {
  await openDemo(page);
  await page.getByLabel("View the demo as role").selectOption("parent");
  await expect(page.getByRole("button", { name: "Create event" })).toHaveCount(0);
  await page.goto("/demo/attendance/");
  await expect(page.getByRole("heading", { name: "My RSVPs" })).toBeVisible();
  const group = page.getByRole("group", { name: /RSVP for Maya/ }).first();
  await group.getByRole("button", { name: "Going" }).click();
  await expect(group.getByRole("button", { name: "Going" })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/demo/assistant/");
  await expect(page.getByText(/You don.t have permission to use the scheduling assistant/)).toBeVisible();
});

test("CSV import validates rows and imports valid ones", async ({ page }) => {
  await openDemo(page, "/demo/schedule-tools/");
  await page.getByRole("button", { name: /Load sample/ }).click();
  await expect(page.getByText("4 ready")).toBeVisible();
  await expect(page.getByText(/1 with errors/)).toBeVisible();
  await page.getByRole("button", { name: "Import 4 events" }).click();
  await expect(page.getByText("4 events imported").first()).toBeVisible();
});

test(".ics download is a valid calendar", async ({ page }) => {
  await openDemo(page, "/demo/sync/");
  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /^Download \(\d+\)$/ }).click()]);
  expect(download.suggestedFilename()).toBe("sportsync.ics");
  const text = await (await download.createReadStream()).toArray().then((c) => Buffer.concat(c).toString("utf8"));
  expect(text.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0")).toBeTruthy();
  expect(text).toContain("BEGIN:VEVENT");
});
