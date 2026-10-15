import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Trabajo", path: "/work", description: "Trabajos seleccionados de Berenjena Studio: comerciales, narrativa y reels filmados en República Dominicana." });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
