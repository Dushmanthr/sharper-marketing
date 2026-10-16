import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { site, assetUrl } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd, localBusinessJsonLd } from "@/lib/seo";

const ogImage = assetUrl("/images/marketing-landing-1.jpeg");

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Sharper Labs Marketing | UK & International Digital Marketing Consultancy",
    template: "%s | Sharper Labs Marketing",
  },
  description:
    "Sharper Labs Marketing is a UK-based digital marketing consultancy serving clients across the UK and internationally with brand marketing, website design and development, social media marketing, PPC, data analysis and organic SEO.",
  keywords: [
    "Digital marketing agency UK",
    "Digital marketing consultancy UK",
    "B2B digital marketing agency UK",
    "Business growth marketing agency",
    "Brand marketing agency UK",
    "Website design agency UK",
    "Social media marketing agency UK",
    "Organic SEO services UK",
    "PPC agency UK",
    "Marketing data analysis services",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: site.url,
    siteName: site.name,
    title: "Sharper Labs Marketing | UK & International Digital Marketing Consultancy",
    description: site.shortDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharper Labs Marketing | UK & International Digital Marketing Consultancy",
    description: site.shortDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${sora.variable} h-full`}>
      <head />
      <body className="min-h-full bg-white text-ink antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd()]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
