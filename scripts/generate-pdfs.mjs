// Generates downloadable PDFs (case study + resume) from the built site using Chrome's print engine.
// Requires `npm run build` (and ideally `npm run screens`) first.
import { spawn } from "node:child_process";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const PORT = 3301;
const server = spawn(process.execPath, ["scripts/serve-out.mjs", String(PORT)], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1200));
const channel = process.env.PW_CHANNEL === "chromium" ? undefined : process.env.PW_CHANNEL ?? "chrome";
const browser = await chromium.launch({ channel });
const ctx = await browser.newContext({ viewport: { width: 1100, height: 1400 } });
await ctx.addInitScript(() => { try { localStorage.setItem("theme", "light"); } catch {} });
fs.mkdirSync("public/downloads", { recursive: true });

const jobs = [
  { path: "/projects/sportsync/", out: "public/downloads/sportsync-case-study.pdf", title: "SportSync case study · Maria Zha-Zha Cornillez Bio" },
  { path: "/resume/", out: "public/downloads/maria-bio-resume.pdf", title: "Resume · Maria Zha-Zha Cornillez Bio" },
];

for (const job of jobs) {
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}${job.path}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((i) => i.setAttribute("loading", "eager"));
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; }))));
  });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: job.out, format: "A4", printBackground: true, margin: { top: "14mm", bottom: "16mm", left: "12mm", right: "12mm" },
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#666;">${job.title} · <span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
  });
  console.log("✓", job.out);
  await page.close();
}
await browser.close();
server.kill();
