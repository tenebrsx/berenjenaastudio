import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { DEFAULT_DESCRIPTION, DEFAULT_OG, SITE, SITE_NAME, SOCIAL } from "@/lib/seo";

// Configure fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${SITE_NAME} · Cine y video en Santo Domingo, RD`, template: "%s · Berenjena Studio" },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_DO",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DEFAULT_DESCRIPTION, images: [DEFAULT_OG] },
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/sobre-mi#jonathan-matos`,
    name: "Jonathan Matos",
    jobTitle: ["Director", "Director de fotografía", "Editor"],
    url: `${SITE}/sobre-mi`,
    sameAs: SOCIAL,
    worksFor: { "@id": `${SITE}/#studio` },
    homeLocation: { "@type": "Place", name: "Santo Domingo, República Dominicana" },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}/#studio`,
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: SITE,
    image: `${SITE}${DEFAULT_OG}`,
    logo: `${SITE}/icon.png`,
    sameAs: SOCIAL,
    founder: { "@id": `${SITE}/sobre-mi#jonathan-matos` },
    address: { "@type": "PostalAddress", addressLocality: "Santo Domingo", addressCountry: "DO" },
    areaServed: { "@type": "Country", name: "República Dominicana", identifier: "DO" },
    knowsAbout: ["Producción audiovisual", "Comerciales", "Dirección de fotografía", "Edición de video", "Reels"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: SITE_NAME,
    url: SITE,
    inLanguage: "es-DO",
    publisher: { "@id": `${SITE}/#studio` },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-DO" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c") }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
