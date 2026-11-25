import type { Metadata } from "next";
import { PageHeader } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { profile } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk" intro="I'm open to Product Designer roles, especially products where complex operations meet everyday people: scheduling, marketplaces, public services." />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 text-sm">
          <div className="card p-5"><p className="font-semibold">Availability</p><p className="mt-1 text-muted">{profile.availability}</p></div>
          {profile.linkedin && <div className="card p-5"><p className="font-semibold">LinkedIn</p><a className="mt-1 block text-info underline" href={profile.linkedin}>{profile.linkedin}</a></div>}
          {profile.github && <div className="card p-5"><p className="font-semibold">GitHub</p><a className="mt-1 block text-info underline" href={profile.github}>{profile.github}</a></div>}
          <div className="card p-5"><p className="font-semibold">Reviewing my application?</p><p className="mt-1 text-muted">My contact details are on the resume and cover letter submitted with my application. The live prototype needs no account.</p></div>
        </div>
        <ContactForm email={profile.contactEmail} />
      </div>
    </>
  );
}
