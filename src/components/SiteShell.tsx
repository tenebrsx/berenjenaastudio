"use client";

import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CursorProvider } from "@/context/CursorContext";
import Cursor from "@/components/Cursor";
import { categoryInfo } from "@/lib/seo";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [categories, setCategories] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await new Promise((r) => setTimeout(r, 2000)); // after first paint; nav links don't need Firebase up front
        const { getProjectsSnapshot } = await import("@/lib/projects");
        const querySnapshot = await getProjectsSnapshot();
        const projects = querySnapshot.docs.map(doc => doc.data());

        // Extract and normalize categories
        const normalizedCategories = new Set<string>();
        const categoryMap = new Map<string, string>(); // slug -> original label

        projects.forEach((p: any) => {
          if (p.category) {
            const normalized = p.category.trim().toLowerCase();
            if (!normalizedCategories.has(normalized)) {
              normalizedCategories.add(normalized);
              const slug = categoryInfo(p.category).slug;
              // Store the first occurrence's formatting as the label, but keyed by unique slug/normalized value to avoid dups
              if (!categoryMap.has(slug)) {
                categoryMap.set(slug, categoryInfo(p.category).label);
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
