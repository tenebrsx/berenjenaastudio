import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Sobre mí", path: "/sobre-mi", noindex: true });

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
