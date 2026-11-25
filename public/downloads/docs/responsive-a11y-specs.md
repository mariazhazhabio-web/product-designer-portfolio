# Responsive design & accessibility specifications

## Breakpoints
| Name | Min width | Layout |
|---|---|---|
| base | 0 | Single column, bottom tab bar, list-first calendar, 16px margins |
| sm | 640 | Two-column cards; week/month calendar available |
| md | 768 | Tablet: dashboard 2 columns |
| lg | 1024 | Sidebar navigation replaces bottom bar; dialogs centered |
| xl | 1280 | Dashboard main + 380px right rail |
| 2xl | 1536 | Wider content, max 1280px for demo pages |

Rules: no horizontal page scroll at 320 px; wide tables and time grids scroll inside their own container with visible scrollbars; sticky headers ≤ 56px; content padded for iOS safe areas (`env(safe-area-inset-bottom)`).

## Per-screen behaviour
| Screen | < 640 px | ≥ 1024 px |
|---|---|---|
| Dashboard | Stats 2×2, cards stacked by priority (family → week → upcoming → alerts) | 4 stats; main + right rail |
| Calendar | Defaults to List; Day/Week grids scroll horizontally | Week default; Month shows 3 chips/day |
| Event editor | Full-height dialog, conflict panel below form | Two columns: form + live check |
| AI assistant | Prompt above results; table scrolls in card | Prompt rail (380px) + results |
| Compare alternatives | Options stacked | 3 options side by side |
| Notifications | Previews stack | List + previews + matrix |

## Accessibility requirements (WCAG 2.2 AA)
| Criterion | Requirement | Implementation |
|---|---|---|
| 1.4.3 Contrast | Text ≥ 4.5:1, large ≥ 3:1 | Token pairs checked on the Design system page |
| 1.4.11 Non-text contrast | UI boundaries ≥ 3:1 | `border-strong` on inputs; focus ring `--ring` |
| 1.4.1 Use of color | Not the only signal | Conflict icons, status badges with text, line-through for cancelled |
| 1.4.10 Reflow | Usable at 320 px | Responsive rules above |
| 2.1.1 Keyboard | All functions | Native buttons/links; tabs arrow keys; dialogs Esc |
| 2.4.3 Focus order | Logical | DOM order matches visual; dialogs trap focus |
| 2.4.7 / 2.4.11 Focus visible / not obscured | Always visible | 2px ring + offset; scroll-padding for sticky header |
| 2.5.8 Target size | ≥ 24×24 | Buttons ≥ 32px; mobile tabs ≥ 48px |
| 2.4.1 Bypass blocks | Skip link | "Skip to content" on portfolio pages |
| 3.3.1 / 3.3.3 Errors | Identify + suggest | Inline messages with fix ("Choose a venue.") |
| 3.3.7 Redundant entry | Avoid re-typing | Duplicate, recurrence, slot suggestions fill the form |
| 4.1.2 Name, role, value | Accessible names | aria-label on icon buttons; switch/tab/radio roles; calendar events announce time + conflict |
| 4.1.3 Status messages | Announced | Toasts and conflict panel use `aria-live="polite"` |
| 2.3.3 Motion | Reduced motion | `prefers-reduced-motion` disables animation |

## Testing approach
- Automated: axe-core in Playwright (recommended next step), Lighthouse accessibility ≥ 95.
- Manual: keyboard-only run of all six usability tasks; NVDA (Windows) and VoiceOver (iOS) smoke tests; 200% zoom; Windows high contrast.
