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
import { useEffect, useState } from "react";

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
  const [categories, setCategories] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://getprojects-ie4kq7otea-uc.a.run.app");
        if (!res.ok) return;
        const projects = await res.json();
        const uniqueCats = Array.from(new Set(projects.map((p: any) => p.category))) as string[];

        setCategories(uniqueCats.map(cat => ({
          label: cat,
          href: `/${slugify(cat)}`
        })));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
        <Header categories={categories} />
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
