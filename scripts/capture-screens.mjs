// Captures high-fidelity screenshots of the running prototype into public/screens/.
// Requires `npm run build` first. Uses installed Google Chrome (set PW_CHANNEL=chromium for bundled Chromium).
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 3300;
const BASE = `http://localhost:${PORT}`;
const OUT = "public/screens";
fs.mkdirSync(OUT, { recursive: true });

const server = spawn(process.execPath, ["scripts/serve-out.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1200));

const channel = process.env.PW_CHANNEL === "chromium" ? undefined : process.env.PW_CHANNEL ?? "chrome";
const browser = await chromium.launch({ channel });
const init = () => { try { localStorage.setItem("theme", "light"); } catch {} };

// Upcoming Saturday (same rule as the seed data)
const d = new Date(); d.setDate(d.getDate() + 1); while (d.getDay() !== 6) d.setDate(d.getDate() + 1);
const key = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
const S1 = key(d);
const tue = new Date(d); tue.setDate(tue.getDate() + 3);

async function ready(page) {
  await page.waitForLoadState("networkidle");
  await page.locator("main [aria-busy=true]").first().waitFor({ state: "detached", timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(400);
}
async function shot(page, name, locator) {
  await page.waitForTimeout(250);
  if (locator) await locator.screenshot({ path: `${OUT}/${name}.png` });
  else await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("✓", name);
}
async function go(page, path) { await page.goto(BASE + path); await ready(page); }
async function dismissWelcome(page) { await go(page, "/demo/"); const b = page.getByRole("button", { name: "Dismiss welcome" }); if (await b.count()) await b.click(); }

// ---------- Desktop ----------
const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await desk.addInitScript(init);
const p = await desk.newPage();
await dismissWelcome(p);
await shot(p, "dashboard-desktop");
await go(p, `/demo/calendar/?view=week&date=${S1}`); await shot(p, "calendar-week-desktop");
await go(p, `/demo/calendar/?view=month&date=${S1}`); await shot(p, "calendar-month-desktop");
await go(p, `/demo/calendar/?view=day&date=${S1}`); await shot(p, "calendar-day-desktop");

await go(p, "/demo/calendar/");
await p.getByRole("button", { name: "Create event" }).first().click();
let dlg = p.getByRole("dialog", { name: "Create event" });
await dlg.getByLabel("Event name").fill("Hawks extra shooting session");
await dlg.getByText("Riverbend Hawks").click();
await dlg.getByLabel("Venue").selectOption("v-ca");
await dlg.getByLabel("Date", { exact: true }).fill(key(tue));
await dlg.getByLabel("Start", { exact: true }).fill("17:30");
await dlg.getByLabel("End", { exact: true }).fill("18:30");
await dlg.getByRole("button", { name: "Find conflict-free times" }).click();
await shot(p, "event-create-desktop");
await p.keyboard.press("Escape");

await go(p, `/demo/calendar/?view=list&date=${S1}`);
await p.getByRole("button", { name: /Riverbend Hawks vs Northside Comets/ }).first().click();
await shot(p, "event-detail-desktop");
await p.keyboard.press("Escape");
await p.getByRole("button", { name: /^Riverbend Hawks practice/ }).first().click();
await p.getByRole("dialog").getByRole("button", { name: "Edit" }).click();
dlg = p.getByRole("dialog", { name: "Edit event" });
await dlg.getByLabel("Start", { exact: true }).fill("17:15");
await dlg.getByRole("button", { name: "Save changes" }).click();
await shot(p, "event-edit-desktop");
await p.keyboard.press("Escape");

await go(p, "/demo/assistant/");
await p.getByRole("button", { name: "Generate proposal" }).click();
await p.getByText("What I understood").waitFor();
await p.waitForTimeout(900);
await p.evaluate(() => window.scrollTo(0, 0));
await shot(p, "assistant-desktop");

await go(p, "/demo/conflicts/"); await shot(p, "conflicts-desktop");
await p.locator("li", { hasText: "Court A double-booked" }).first().getByRole("button", { name: "Compare alternatives" }).click();
await p.getByRole("dialog", { name: "Compare alternatives" }).getByRole("radio").first().click();
await shot(p, "compare-desktop");
await p.keyboard.press("Escape");

await go(p, "/demo/attendance/"); await shot(p, "attendance-desktop");
await go(p, "/demo/teams/"); await shot(p, "teams-desktop");
await go(p, "/demo/venues/"); await p.getByRole("button", { name: "Field 1" }).click(); await shot(p, "venues-desktop");
await go(p, "/demo/schedule-tools/"); await p.getByRole("button", { name: /Load sample/ }).click(); await shot(p, "import-desktop");
await go(p, "/demo/schedule-tools/");
await p.locator('input[type=file]').setInputFiles({ name: "schedule.csv", mimeType: "text/csv", buffer: Buffer.from("name,when\nGame,tomorrow\n") });
await shot(p, "state-error");
await go(p, "/demo/sync/"); await shot(p, "sync-desktop");
await go(p, "/demo/notifications/"); await shot(p, "notifications-desktop");
await go(p, "/demo/settings/"); await shot(p, "settings-desktop");
await go(p, "/demo/states/");
await shot(p, "state-loading", p.locator("section[aria-label=Loading]"));
await shot(p, "state-empty", p.locator("section[aria-label=Empty]"));
await p.getByRole("button", { name: "Cancel Saturday's games" }).click();
await shot(p, "state-confirm");
await p.keyboard.press("Escape");
await p.getByLabel("View the demo as role").selectOption("parent");
await go(p, "/demo/assistant/"); await shot(p, "state-permission");

await go(p, "/design-system/"); await p.locator("#color").scrollIntoViewIfNeeded(); await p.evaluate(() => window.scrollBy(0, -80)); await shot(p, "design-system");
for (const f of ["lo", "mid"]) { await go(p, `/wireframes/?focus=dash-d&f=${f}`); await shot(p, `wf-${f}`, p.locator("[data-testid=wf-focus]")); }
await desk.close();

// ---------- Mobile ----------
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mob.addInitScript(init);
const m = await mob.newPage();
await dismissWelcome(m);
await shot(m, "dashboard-mobile");
await go(m, `/demo/calendar/?date=${S1}`); await shot(m, "calendar-mobile");
await go(m, "/demo/assistant/");
await m.getByRole("button", { name: "Generate proposal" }).click();
await m.getByText("What I understood").waitFor(); await m.waitForTimeout(1200);
await shot(m, "assistant-mobile");
await go(m, "/demo/teams/"); await m.mouse.wheel(0, 300); await shot(m, "teams-mobile");
await go(m, "/demo/onboarding/"); await shot(m, "onboarding-mobile");
await go(m, "/demo/states/");
await m.getByRole("switch", { name: "Simulate offline" }).click();
await m.getByRole("navigation", { name: "SportSync mobile navigation" }).getByRole("link", { name: "Dashboard" }).click();
await m.waitForTimeout(800);
await shot(m, "state-offline-mobile");
await m.getByLabel("View the demo as role").selectOption("parent");
await go(m, "/demo/attendance/"); await shot(m, "rsvp-parent-mobile");
await go(m, "/demo/share/?team=t-hawks"); await shot(m, "share-mobile");
await mob.close();

await browser.close();
server.kill();
console.log("Screenshots saved to", OUT);
