import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre nosotros" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
