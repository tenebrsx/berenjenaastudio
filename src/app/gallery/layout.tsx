import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Galería", path: "/gallery", description: "Galería de fotogramas y momentos de rodaje de Berenjena Studio, cine y video en Santo Domingo, República Dominicana." });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
