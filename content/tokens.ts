// Design tokens mirrored from app/globals.css. `npm run tokens` exports them to design-handoff/tokens.json
// (W3C Design Tokens format) for Figma Variables / Tokens Studio import.

export const color = {
  light: {
    bg: "#f7f7f4", surface: "#ffffff", "surface-2": "#f0f1ec", "surface-3": "#e6e8e1", border: "#d9dcd3", "border-strong": "#b9beb2",
    text: "#14181f", muted: "#4f5866", subtle: "#6b7380",
    primary: "#0b6e5b", "primary-hover": "#095c4c", "primary-soft": "#e1f2ec", "primary-fg": "#ffffff",
    accent: "#c2410c", "accent-soft": "#fdeee4",
    info: "#1d4ed8", "info-soft": "#e5ecfd", success: "#15803d", "success-soft": "#e3f4e8", warning: "#a35c00", "warning-soft": "#fff2db", danger: "#b42318", "danger-soft": "#fdeceb",
    "ev-game": "#0b6e5b", "ev-practice": "#1d4ed8", "ev-tournament": "#c2410c", "ev-meeting": "#6d28d9", ring: "#1d4ed8",
  },
  dark: {
    bg: "#0c1016", surface: "#131922", "surface-2": "#1a212c", "surface-3": "#232c39", border: "#2b3543", "border-strong": "#3d4a5c",
    text: "#eef1f5", muted: "#a9b3c1", subtle: "#8c97a6",
    primary: "#38c9a4", "primary-hover": "#5fd8b8", "primary-soft": "#10322b", "primary-fg": "#06231c",
    accent: "#ff9a62", "accent-soft": "#3a2117",
    info: "#7aa2ff", "info-soft": "#18254a", success: "#4ade80", "success-soft": "#10301d", warning: "#fbbf24", "warning-soft": "#33270b", danger: "#ff8a80", "danger-soft": "#3b1715",
    "ev-game": "#38c9a4", "ev-practice": "#7aa2ff", "ev-tournament": "#ff9a62", "ev-meeting": "#c4a7ff", ring: "#7aa2ff",
  },
};

export const typography = [
  { token: "display-xl", size: 60, line: 1.05, weight: 600, family: "Space Grotesk", use: "Hero headings" },
  { token: "display-lg", size: 48, line: 1.1, weight: 600, family: "Space Grotesk", use: "Page titles" },
  { token: "heading-lg", size: 30, line: 1.2, weight: 600, family: "Space Grotesk", use: "Section titles" },
  { token: "heading-md", size: 20, line: 1.3, weight: 600, family: "Space Grotesk", use: "Card titles, dialogs" },
  { token: "body-lg", size: 18, line: 1.6, weight: 400, family: "Inter", use: "Intros" },
  { token: "body", size: 14, line: 1.5, weight: 400, family: "Inter", use: "Default UI text" },
  { token: "label", size: 14, line: 1.4, weight: 500, family: "Inter", use: "Buttons, form labels" },
  { token: "caption", size: 12, line: 1.4, weight: 400, family: "Inter", use: "Metadata, hints" },
  { token: "micro", size: 11, line: 1.3, weight: 500, family: "Inter", use: "Calendar chips, badges" },
];

export const spacing = [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
export const radius = { sm: 6, md: 8, lg: 10, xl: 14, "2xl": 16, full: 9999 };
export const elevation = { card: "0 1px 2px rgb(20 24 31 / .06), 0 8px 24px -12px rgb(20 24 31 / .18)", overlay: "0 25px 50px -12px rgb(0 0 0 / .25)" };
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
export const grid = [
  { name: "Mobile", columns: 4, gutter: 16, margin: 16, max: "100%" },
  { name: "Tablet", columns: 8, gutter: 24, margin: 24, max: "100%" },
  { name: "Desktop", columns: 12, gutter: 24, margin: 24, max: "1200px content" },
  { name: "App shell", columns: 12, gutter: 24, margin: 32, max: "Sidebar 240px + fluid" },
];

// WCAG relative luminance contrast
function lum(hex: string) {
  const v = hex.replace("#", "").match(/.{2}/g)!.map((h) => parseInt(h, 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
}

export function toW3CTokens() {
  const out: Record<string, unknown> = { $description: "SportSync design tokens (W3C Design Tokens format). Generated from content/tokens.ts." };
  for (const mode of ["light", "dark"] as const) {
    out[`color-${mode}`] = Object.fromEntries(Object.entries(color[mode]).map(([k, v]) => [k, { $type: "color", $value: v }]));
  }
  out.typography = Object.fromEntries(typography.map((t) => [t.token, { $type: "typography", $value: { fontFamily: t.family, fontSize: `${t.size}px`, lineHeight: t.line, fontWeight: t.weight } }]));
  out.spacing = Object.fromEntries(spacing.map((s) => [String(s), { $type: "dimension", $value: `${s}px` }]));
  out.radius = Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, { $type: "dimension", $value: `${v}px` }]));
  out.shadow = Object.fromEntries(Object.entries(elevation).map(([k, v]) => [k, { $type: "shadow", $value: v }]));
  out.breakpoint = Object.fromEntries(Object.entries(breakpoints).map(([k, v]) => [k, { $type: "dimension", $value: `${v}px` }]));
  return out;
}
