// Runs before `next build`: copies docs for download, exports design tokens and SVG icons for the Figma handoff.
import fs from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Icons from "lucide-react";
import { toW3CTokens } from "../content/tokens";

const root = process.cwd();
const out = (...p: string[]) => path.join(root, ...p);
const ensure = (d: string) => fs.mkdirSync(d, { recursive: true });

// 1. Docs → public/downloads/docs
ensure(out("public/downloads/docs"));
for (const f of fs.readdirSync(out("docs")).filter((x) => x.endsWith(".md"))) {
  fs.copyFileSync(out("docs", f), out("public/downloads/docs", f));
}

// 2. Tokens
const tokens = JSON.stringify(toW3CTokens(), null, 2);
ensure(out("design-handoff"));
fs.writeFileSync(out("design-handoff/tokens.json"), tokens);
fs.writeFileSync(out("public/downloads/tokens.json"), tokens);

// 3. Icons (Lucide, ISC license)
const names = ["CalendarDays", "Sparkles", "AlertTriangle", "UserCheck", "Users", "Building2", "Bell", "RefreshCw", "FileUp", "Trophy", "Dumbbell", "Clock", "MapPin", "Repeat", "Undo2", "Lock", "WifiOff", "Settings"] as const;
ensure(out("design-handoff/icons"));
for (const n of names) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[n];
  const svg = renderToStaticMarkup(createElement(Icon, { size: 24, strokeWidth: 2 })).replace(/ class="[^"]*"/, "");
  fs.writeFileSync(out("design-handoff/icons", `${n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}.svg`), `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
}
console.log(`prepare: ${fs.readdirSync(out("docs")).length} docs, tokens.json, ${names.length} icons`);
