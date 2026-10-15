import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ path: "/" });

export default function Home() {
    return <HomeClient />;
}
