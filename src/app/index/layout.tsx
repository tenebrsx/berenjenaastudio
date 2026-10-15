import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Índice", path: "/index", description: "Índice de todos los proyectos de Berenjena Studio: comerciales, narrativa y reels desde Santo Domingo, República Dominicana." });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
