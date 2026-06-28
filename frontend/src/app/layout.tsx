import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CustomCursor } from "@/src/components/ui/CustomCursor";
import { LenisProvider } from "@/lib/lenis";

export const metadata: Metadata = {
  title: "PANTHEON — Luxury Beauty Maison",
  description:
    "A curated beauty experience. Precision, artistry, and intimacy — by appointment.",
  keywords: ["luxury salon", "beauty maison", "hair", "makeup", "skincare"],
  openGraph: {
    title: "PANTHEON — Luxury Beauty Maison",
    description: "Beauty, composed with precision.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="ltr">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Grain overlay — فقط 3.5% opacity */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* Custom cursor — فقط desktop */}
        <CustomCursor />

        {/* Smooth scroll wrapper */}
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
