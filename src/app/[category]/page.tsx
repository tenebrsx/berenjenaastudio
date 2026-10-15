import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

import { getProjectsSnapshot } from "@/lib/projects";
import { slugify } from "@/lib/utils";

export async function generateStaticParams() {
    try {
        const querySnapshot = await getProjectsSnapshot();
        const categories = new Set<string>();

        querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            if (data.category) {
                categories.add(slugify(String(data.category)));
            }
        });

        // Always include default categories even if not in DB yet, to be safe
        const defaultCategories = ["commercial", "music-video", "narrative", "spec"];
        defaultCategories.forEach(c => categories.add(c));

        return Array.from(categories).map((category) => ({
            category,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const label = decodeURIComponent(category).replace(/-/g, " ");
    return { title: label.charAt(0).toUpperCase() + label.slice(1) };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = await params;
    return <CategoryClient category={resolvedParams.category} />;
}
