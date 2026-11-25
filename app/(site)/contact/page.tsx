import type { Metadata } from "next";
import { Briefcase, Clock, CodeXml, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/blocks";
import { ContactForm } from "@/components/site/contact-form";
import { profile } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  const links: [typeof Mail, string, string, string][] = [
    [Mail, "Email", profile.contactEmail, `mailto:${profile.contactEmail}`],
    [Phone, "Phone", profile.phone, `tel:${profile.phone.replace(/\s/g, "")}`],
    [Briefcase, "LinkedIn", profile.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), profile.linkedin],
    [CodeXml, "GitHub", profile.github.replace(/^https?:\/\//, ""), profile.github],
  ];
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk" intro="I'm open to remote Product Designer roles with part-time or flexible hours, especially products where complex operations meet everyday people: scheduling, marketplaces, public services." />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 text-sm">
          <ul className="card divide-y divide-border">
            {links.filter(([, , v]) => v).map(([Icon, label, value, href]) => (
              <li key={label}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-3 p-4 hover:bg-surface-2">
                  <Icon className="size-5 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0"><span className="block font-semibold">{label}</span><span className="block break-all text-muted">{value}</span></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="card p-5">
            <p className="flex items-center gap-2 font-semibold"><Clock className="size-4 text-primary" aria-hidden />Availability</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              {profile.availabilityDetails.map(([k, v]) => <div key={k} className="contents"><dt className="text-muted">{k}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
        <ContactForm email={profile.contactEmail} />
      </div>
    </>
  );
}
