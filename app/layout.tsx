import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AUTOPS — Procurement Operations",
  description: "A unified procurement workspace for lead verification, supplier discovery, RFQs, quotation comparison, and final quotes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
