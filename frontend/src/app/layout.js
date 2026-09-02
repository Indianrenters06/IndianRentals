import "@fontsource/mona-sans/400.css";
import "@fontsource/mona-sans/500.css";
import "@fontsource/mona-sans/600.css";
import "@fontsource/mona-sans/700.css";
import "@fontsource/mona-sans/800.css";
import "./globals.css";
import Script from "next/script";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, DEFAULT_OG_IMAGE } from "@/config/site";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ""; // e.g. G-XXXXXXXXXX
const GSC_TOKEN = process.env.NEXT_PUBLIC_GSC_TOKEN || ""; // Google Search Console HTML-tag token

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Rent Laptops, MacBooks, Cameras & AV Equipment in India`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "rent laptop", "macbook on rent", "camera rental", "DSLR rental",
    "AV equipment rental", "server rental", "office equipment rental",
    "tech rental India", "IndianRenters", "gadget rental",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Google Search Console domain verification (add token via NEXT_PUBLIC_GSC_TOKEN env var)
  ...(GSC_TOKEN ? { verification: { google: GSC_TOKEN } } : {}),
};

import ClientLayout from "@/components/ClientLayout";
import Providers from "@/components/Providers";
import StickyMobileCTA from "@/components/StickyMobileCTA";

// Organization + WebSite structured data — helps Google and AI assistants
// understand and cite the brand.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: DEFAULT_OG_IMAGE,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/products?search={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans bg-gray-50 flex flex-col min-h-screen antialiased overflow-x-hidden max-w-full`}>
        {/* Google Analytics 4 — only loads when GA_ID env var is set */}
        {GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
          <StickyMobileCTA />
        </Providers>
      </body>
    </html>
  );
}
