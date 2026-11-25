import type { Metadata } from "next";
import { PageHeader } from "@/components/site/blocks";
import { WireframeGallery } from "@/components/site/wireframe-gallery";

export const metadata: Metadata = { title: "Wireframes", description: "28 SportSync screens and interface states in low, mid and high fidelity." };

export default function WireframesPage() {
  return (
    <>
      <PageHeader eyebrow="SportSync · Design" title="Wireframes: low, mid and high fidelity"
        intro="28 screens and interface states, each defined once and shown at three levels of fidelity. High fidelity images are real screenshots of the running prototype, so every screen links to its live version." />
      <div className="container-page py-10"><WireframeGallery /></div>
    </>
  );
}
