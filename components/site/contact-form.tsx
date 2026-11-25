"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, Field, Input, Textarea } from "@/components/ui/primitives";

// No backend: the form opens the visitor's email app with the message pre-filled (mailto).
export function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const submit = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(from)) e.from = "Please enter a valid email so I can reply.";
    if (msg.trim().length < 10) e.msg = "Please write a short message (10+ characters).";
    setErrors(e);
    if (Object.keys(e).length) return;
    if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio enquiry from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n${name} · ${from}`)}`;
    setDone(true);
  };
  return (
    <form className="card space-y-4 p-6" noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <p className="text-lg font-semibold">Send a message</p>
      <Field label="Your name" htmlFor="c-name" error={errors.name} required><Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} autoComplete="name" /></Field>
      <Field label="Your email" htmlFor="c-email" error={errors.from} required><Input id="c-email" type="email" value={from} onChange={(e) => setFrom(e.target.value)} aria-invalid={!!errors.from} autoComplete="email" /></Field>
      <Field label="Message" htmlFor="c-msg" error={errors.msg} required><Textarea id="c-msg" value={msg} onChange={(e) => setMsg(e.target.value)} aria-invalid={!!errors.msg} /></Field>
      <Button type="submit"><Send aria-hidden />Send</Button>
      {done && (email
        ? <Alert tone="success" title="Opening your email app">Your message is pre-filled. Just press send.</Alert>
        : <Alert tone="info" title="Thanks for your message">Direct email isn&apos;t enabled on this site yet. Please use the contact details in my application. Your message was not sent or stored.</Alert>)}
    </form>
  );
}
