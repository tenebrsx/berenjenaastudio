import CategoryClient from "./CategoryClient";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { slugify } from "@/lib/utils";

export async function generateStaticParams() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const categories = new Set<string>();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.category) {
                categories.add(slugify(data.category));
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

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = await params;
    return <CategoryClient category={resolvedParams.category} />;
}
