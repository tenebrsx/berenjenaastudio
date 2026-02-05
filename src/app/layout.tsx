"use client";

import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CursorProvider } from "@/context/CursorContext";
import Cursor from "@/components/Cursor";
import { PROJECTS } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { usePathname } from "next/navigation";

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

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Generate categories from static data
  const uniqueCategories = Array.from(new Set(PROJECTS.map(p => p.category)));

  const categoryLinks = uniqueCategories.map(cat => ({
    label: cat,
    href: `/${slugify(cat)}`
  }));

  // For admin routes, skip the public header/footer
  if (isAdminRoute) {
    return (
      <>
        {children}
      </>
    );
  }

  // For public routes, include header/footer
  return (
    <CursorProvider>
      <Cursor />
      <SmoothScroll>
        <Header categories={categoryLinks} />
        {children}
        <Footer />
      </SmoothScroll>
    </CursorProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
