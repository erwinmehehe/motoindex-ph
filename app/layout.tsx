import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import "./research-ux.css";
import "./v247.css";
import "./v260.css";
import "./v261.css";
import "./v270.css";
import "./v280.css";
import "./tailwind.css";
import "./dealer-directory.css";
import "./redesign.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Analytics } from "@/components/Analytics";
import { CompareTray } from "@/components/CompareTray";
import { publicMotorcycles } from "@/lib/data";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "MotoIndex PH — Motorcycle Prices, Specs & Gear", template: "%s" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Motorcycles",
  formatDetection: { telephone: false },
  verification: {
    google: "semQnFpP4-Phz-FitfvqFxwwida4f7PGe-hXc11sUz8"
  },
  icons: {
    icon: [
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/icon-48.png",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: SITE_NAME,
    description: "Motorcycle prices, specs, fitment and buying tools for the Philippines.",
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
    images: [{ url: absoluteUrl("/brand/motoindex-og.png"), width: 1200, height: 630, alt: "MotoIndex PH" }]
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION, images: [absoluteUrl("/brand/motoindex-og.png")] }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/motoindex-mark.svg`,
  description: SITE_DESCRIPTION
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-PH" className={`${manrope.variable} ${sora.variable}`}><body><Analytics/><a className="skip-link" href="#main-content">Skip to main content</a><Header /><main id="main-content" tabIndex={-1}>{children}</main><CompareTray models={publicMotorcycles.map(({id,make,model,slug})=>({id,make,model,slug}))}/><Footer /><JsonLd data={[organizationSchema, websiteSchema]} /></body></html>;
}
