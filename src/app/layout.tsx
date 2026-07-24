import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: {
    default: "EPC Supplier Portal — SRM & Approved Vendor List",
    template: "%s · EPC Supplier Portal",
  },
  description:
    "Supplier registration and Approved Vendor List (AVL) portal for Solar EPC and EV infrastructure contractors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
