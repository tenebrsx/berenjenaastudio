import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

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

const description =
  "Berenjena Studio: productora audiovisual. Comerciales, narrativa y reels.";

export const metadata: Metadata = {
  metadataBase: new URL("https://berenjenastudio.com"),
  title: { default: "Berenjena Studio", template: "%s · Berenjena Studio" },
  description,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "Berenjena Studio",
    title: "Berenjena Studio",
    description,
  },
  twitter: { card: "summary_large_image", title: "Berenjena Studio", description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
