import type { Metadata } from "next";
import { DemoProvider } from "@/lib/sportsync/store";
import { DemoShell } from "@/components/demo/shell";

export const metadata: Metadata = {
  title: { default: "SportSync demo", template: "%s · SportSync demo" },
  description: "Interactive SportSync scheduling prototype with fictional sample data. No sign-up needed.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <DemoShell>{children}</DemoShell>
    </DemoProvider>
  );
}
