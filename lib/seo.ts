import type { Metadata } from "next";
import { site, offices, routeUrl, assetUrl, socials } from "./site";

/**
 * SEO / AIO / AEO helpers. Centralises page metadata and the JSON-LD
 * structured data that answer engines (Google, ChatGPT, Perplexity) read.
 */

type PageMetaInput = {
  title: string;
  description: string;
  path: string; // e.g. "/about"
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function pageMeta({
  title,
  description,
  path,
  image = "/images/marketing-landing-1.jpeg",
  keywords = [],
  type = "website",
}: PageMetaInput): Metadata {
  const url = routeUrl(path);
  const imageUrl = assetUrl(image);
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type,
      locale: "en_GB",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

const fullAddress = (o: typeof offices.head | typeof offices.registered) => ({
  "@type": "PostalAddress",
  streetAddress: `${o.name}, ${o.street}`,
  addressLocality: o.city,
  postalCode: o.postcode,
  addressCountry: "GB",
});

/** Organization schema, emitted once in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${site.url}#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: assetUrl("/logo/logo.svg"),
      width: 300,
      height: 80,
    },
    image: assetUrl("/images/marketing-landing-1.jpeg"),
    email: site.email,
    telephone: site.phone,
    slogan: site.tagline,
    description: site.shortDescription,
    foundingDate: site.founded,
    sameAs: socials.map((s) => s.href),
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "AdministrativeArea", name: "International" },
    ],
    address: [fullAddress(offices.registered), fullAddress(offices.head)],
    knowsAbout: [
      "Digital marketing",
      "Brand marketing and branding",
      "Website design and development",
      "Social media marketing",
      "Pay-per-click advertising (PPC)",
      "Marketing data analysis",
      "Organic search engine optimisation (SEO)",
      "Lead generation",
    ],
  };
}

/**
 * LocalBusiness / ProfessionalService schema for the London office.
 * Emitted on homepage, /about and /contact.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}#localbusiness`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    priceRange: "££",
    currenciesAccepted: "GBP",
    paymentAccepted: "Bank Transfer, Credit Card",
    image: assetUrl("/images/marketing-landing-1.jpeg"),
    logo: assetUrl("/logo/logo.svg"),
    description: site.shortDescription,
    slogan: site.tagline,
    foundingDate: site.founded,
    address: fullAddress(offices.head),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.5959,
      longitude: -0.2526,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "AdministrativeArea", name: "International" },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${offices.head.name} ${offices.head.street} ${offices.head.city} ${offices.head.postcode}`,
    )}`,
    sameAs: socials.map((s) => s.href),
    parentOrganization: { "@id": `${site.url}#organization` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    description: site.shortDescription,
    publisher: { "@id": `${site.url}#organization` },
    inLanguage: "en-GB",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: routeUrl(item.path),
      })),
    ],
  };
}

/** Service schema for a marketing service page. */
export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${routeUrl(input.path)}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.name,
    provider: {
      "@id": `${site.url}#organization`,
      name: site.name,
      telephone: site.phone,
    },
    areaServed: [
      { "@type": "City", name: "London" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    url: routeUrl(input.path),
    offers: {
      "@type": "Offer",
      name: `${input.name} Enquiry`,
      description: "Free initial consultation available.",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url: routeUrl("/contact"),
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: routeUrl("/contact"),
      servicePhone: site.phone,
      availableLanguage: { "@type": "Language", name: "English" },
    },
    keywords: input.keywords?.join(", "),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * WebPage schema for key pages. Adds `speakable` for AEO / answer engine
 * optimisation.
 */
export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${routeUrl(input.path)}#webpage`,
    name: input.name,
    description: input.description,
    url: routeUrl(input.path),
    inLanguage: "en-GB",
    isPartOf: { "@id": `${site.url}#website` },
    about: { "@id": `${site.url}#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".prose-legal"],
    },
  };
}

/**
 * BlogPosting schema for SEO & AEO (Google, Perplexity, ChatGPT).
 */
export function blogPostingJsonLd(input: {
  title: string;
  description: string;
  path: string;
  image: string;
  publishedAt: string;
  authorName: string;
  category: string;
  keywords: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${routeUrl(input.path)}#article`,
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": routeUrl(input.path),
    },
    author: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@id": `${site.url}#organization`,
    },
    image: assetUrl(input.image),
    articleSection: input.category,
    keywords: input.keywords.join(", "),
    inLanguage: "en-GB",
  };
}

