import type { Metadata } from "next";
import { Heart, MessageCircle, Phone, Plus, Search, Shield, Video } from "lucide-react";
import { CaseHero, FeatureTable, Honesty, Section, Showcase, type FeatureRow } from "@/components/site/case-study";

export const metadata: Metadata = { title: "Frendora case study", description: "Frendora: mobile-first social networking and communication platform concept." };

const rows: FeatureRow[] = [
  { area: "Social", feature: "News feed with chronological and “close friends” views", status: "proposed", note: "Design concept on this page" },
  { area: "Social", feature: "Friend connections (request, accept, suggestions with reasons)", status: "proposed", note: "Design concept" },
  { area: "Profiles", feature: "User profiles with per-field audience controls", status: "proposed", note: "Design concept" },
  { area: "Moments", feature: "Moments & stories (24h, audience picker, reactions)", status: "proposed", note: "Design concept" },
  { area: "Frendora Chat", feature: "1:1 and group messaging, read receipts toggle", status: "proposed", note: "Design concept" },
  { area: "Calling", feature: "Voice and video calling", status: "proposed", note: "Requires a real-time media provider (WebRTC/SFU)" },
  { area: "Trust", feature: "Identity verification (optional verified badge)", status: "proposed", note: "Could reuse WideKonek's provider research" },
  { area: "Safety", feature: "Privacy & account security (2FA, login alerts, session list)", status: "proposed", note: "Design concept" },
  { area: "Community", feature: "Reporting, blocking, moderation queue, community guidelines", status: "proposed", note: "Design concept" },
];

function PhoneFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <figure className="flex flex-col items-center">
      <div className="h-[460px] w-[230px] overflow-hidden rounded-[2.2rem] border-[9px] border-[#1c2129] bg-white text-slate-900 shadow-xl">
        <div className="mx-auto mt-1.5 h-4 w-20 rounded-full bg-[#1c2129]" aria-hidden />
        {children}
      </div>
      <figcaption className="mt-3 text-sm font-semibold">{title}</figcaption>
    </figure>
  );
}

export default function Frendora() {
  return (
    <>
      <CaseHero eyebrow="Case study · Founder concept" name="Frendora" tagline="Closer connections, safer by design" color="#5b21b6"
        intro="A mobile-first social networking and communication platform built around real friendships: a calm feed, private moments, chat and calls, with privacy controls people can actually understand."
        facts={[["Role", "Founder · product concept & UX"], ["Platform", "Mobile-first (iOS / Android), web companion"], ["Focus", "Privacy, safety, meaningful connection"], ["Status", "To be confirmed by Maria"]]} />
      <div className="container-page pt-16">
        <Honesty><strong>Status note:</strong> no Frendora source files or designs were found on this computer, so every feature on this page is shown as a <strong>proposed design concept</strong>, created for this portfolio. Maria will update the status table with any work already completed elsewhere.</Honesty>
        <Section id="concept" title="Concept screens" intro="Low-commitment, mobile-first concepts showing the core loops. Brand color is a working choice (violet) until Frendora's own brand assets are added.">
          <div className="grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <PhoneFrame title="Feed + moments">
              <div className="flex items-center justify-between px-3 pt-2"><p className="text-[15px] font-bold text-[#5b21b6]">frendora</p><Search className="size-4" aria-hidden /></div>
              <div className="mt-2 flex gap-2 overflow-hidden px-3">{["You", "Mia", "Leo", "Ana", "Kai"].map((n, i) => <div key={n} className="flex flex-col items-center gap-0.5"><span className={`flex size-11 items-center justify-center rounded-full text-xs font-bold text-white ${i === 0 ? "bg-slate-300" : "bg-gradient-to-br from-[#7c3aed] to-[#ec4899] ring-2 ring-white ring-offset-2 ring-offset-[#c4b5fd]"}`}>{i === 0 ? <Plus className="size-4" aria-hidden /> : n[0]}</span><span className="text-[9px]">{n}</span></div>)}</div>
              <div className="m-3 rounded-xl border border-slate-200 p-2.5"><p className="text-[11px] font-semibold">Mia · close friends</p><div className="mt-1.5 h-24 rounded-lg bg-gradient-to-br from-[#ede9fe] to-[#fce7f3]" /><p className="mt-1.5 flex gap-3 text-[10px] text-slate-500"><Heart className="size-3" aria-hidden />12<MessageCircle className="size-3" aria-hidden />3</p></div>
              <p className="px-3 text-center text-[10px] text-slate-500">You&apos;re all caught up ✓</p>
            </PhoneFrame>
            <PhoneFrame title="Frendora Chat">
              <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2"><span className="flex size-7 items-center justify-center rounded-full bg-[#7c3aed] text-[10px] font-bold text-white">L</span><p className="flex-1 text-[12px] font-semibold">Leo</p><Phone className="size-4 text-[#5b21b6]" aria-hidden /><Video className="size-4 text-[#5b21b6]" aria-hidden /></div>
              <div className="space-y-2 p-3 text-[11px]"><p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-1.5">Movie tonight?</p><p className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-[#7c3aed] px-3 py-1.5 text-white">Yes! 7pm 🎬</p><p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-1.5">I&apos;ll call you after work</p></div>
              <div className="mx-3 mt-16 rounded-full border border-slate-300 px-3 py-2 text-[10px] text-slate-400">Message…</div>
            </PhoneFrame>
            <PhoneFrame title="Call">
              <div className="flex h-full flex-col items-center bg-gradient-to-b from-[#2e1065] to-[#5b21b6] pt-16 text-white">
                <span className="flex size-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">L</span>
                <p className="mt-3 text-[15px] font-semibold">Leo</p><p className="text-[11px] text-white/70">Calling… end-to-end encrypted</p>
                <div className="mt-auto mb-16 flex gap-5"><span className="flex size-11 items-center justify-center rounded-full bg-white/20"><Video className="size-5" aria-hidden /></span><span className="flex size-11 items-center justify-center rounded-full bg-[#ef4444]"><Phone className="size-5 rotate-[135deg]" aria-hidden /></span></div>
              </div>
            </PhoneFrame>
            <PhoneFrame title="Privacy checkup">
              <div className="p-3 text-[11px]"><p className="flex items-center gap-1.5 text-[14px] font-bold"><Shield className="size-4 text-[#5b21b6]" aria-hidden />Privacy checkup</p><p className="mt-1 text-slate-500">3 of 5 steps done</p><div className="mt-2 h-1.5 rounded-full bg-slate-200"><span className="block h-full w-3/5 rounded-full bg-[#7c3aed]" /></div>
                {[["Who can see your birthday", "Friends"], ["Who can find you by phone", "Nobody"], ["Two-factor authentication", "On"], ["Active sessions", "2 devices"], ["Location in moments", "Off"]].map(([l, v]) => <div key={l} className="mt-2 flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-2"><span>{l}</span><span className="font-semibold text-[#5b21b6]">{v}</span></div>)}
              </div>
            </PhoneFrame>
          </div>
        </Section>
        <Section id="showcase" title="Experience design">
          <Showcase items={[
            { title: "Social networking & news feed", status: "proposed", body: "A finite, chronological feed that ends (“You're all caught up”) to respect attention.", points: ["Chronological by default", "Close-friends filter", "No infinite scroll traps"] },
            { title: "Friend connections", status: "proposed", body: "Suggestions explain why (mutual friends, same school) and are never based on contacts without consent.", points: ["Request / accept / ignore silently", "Reasoned suggestions", "Easy unfriend & restrict"] },
            { title: "User profiles", status: "proposed", body: "Each profile field has its own audience control shown inline.", points: ["Per-field visibility", "Preview “as a friend / as public”"] },
            { title: "Moments & stories", status: "proposed", body: "24-hour moments with an audience picker before posting, not after.", points: ["Audience picker first", "Location off by default", "Reactions without public counts"] },
            { title: "Frendora Chat, messaging & calling", status: "proposed", body: "1:1 and group chat with voice/video calling; read receipts optional.", points: ["Message requests from non-friends", "Encrypted calling (provider TBD)", "Mute, archive, disappearing messages"] },
            { title: "Identity verification", status: "proposed", body: "Optional verified badge to reduce impersonation, without storing ID images.", points: ["Provider-hosted verification", "Badge explains what was verified"] },
            { title: "Privacy & account security", status: "proposed", body: "A guided privacy checkup plus 2FA, login alerts and session management.", points: ["Plain-language settings", "Session list with remote sign-out"] },
            { title: "Community management", status: "proposed", body: "Report from anywhere, transparent outcomes, and a moderator queue with severity triage.", points: ["Report status visible to reporter", "Block = invisible both ways", "Guidelines in plain language"] },
            { title: "Mobile-first design", status: "proposed", body: "Thumb-reachable actions, bottom navigation, offline drafts.", points: ["One-handed reach zones", "Dynamic type support", "Dark mode"] },
          ]} />
        </Section>
        <Section id="status" title="Completed, in progress & proposed"><FeatureTable rows={rows} /></Section>
      </div>
    </>
  );
}
