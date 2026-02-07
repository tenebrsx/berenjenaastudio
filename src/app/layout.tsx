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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects = querySnapshot.docs.map(doc => doc.data());

        // Extract and normalize categories
        const normalizedCategories = new Set<string>();
        const categoryMap = new Map<string, string>(); // slug -> original label

        projects.forEach((p: any) => {
          if (p.category) {
            const normalized = p.category.trim().toLowerCase();
            if (!normalizedCategories.has(normalized)) {
              normalizedCategories.add(normalized);
              const slug = slugify(p.category);
              // Store the first occurrence's formatting as the label, but keyed by unique slug/normalized value to avoid dups
              if (!categoryMap.has(slug)) {
                categoryMap.set(slug, p.category.trim());
              }
            }
          }
        });

        // Convert map to array
        const uniqueCategories = Array.from(categoryMap.entries()).map(([slug, label]) => ({
          label: label,
          href: `/${slug}`
        })).sort((a, b) => a.label.localeCompare(b.label));

        setCategories(uniqueCategories);
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
        suppressHydrationWarning
      >
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
