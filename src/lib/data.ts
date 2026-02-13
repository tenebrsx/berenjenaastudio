export interface Project {
    id: string;
    title?: string;
    category: string;

    year: string;
    thumbnail: string;
    thumbnailPoster?: string; // Optional static image for video thumbnails
    videoUrl?: string | null;
    credits?: string | null;
    description?: string | null;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

export const PROJECTS: Project[] = [
    {
        id: "1",
        title: "Midnight Echo",
        category: "Commercial",
        year: "2025",
        thumbnail: "https://placehold.co/1920x1080/1a1a1a/FFF?text=Midnight+Echo",
        slug: "midnight-echo",
    },
    {
        id: "2",
        title: "Neon Drift",
        category: "Music Video",
        year: "2024",
        thumbnail: "https://placehold.co/1920x1080/2b2b2b/FFF?text=Neon+Drift",
        slug: "neon-drift",
    },
    {
        id: "3",
        title: "Urban Solitude",
        category: "Narrative",
        year: "2024",
        thumbnail: "https://placehold.co/1920x1080/111/FFF?text=Urban+Solitude",
        slug: "urban-solitude",
    },
    {
        id: "4",
        title: "Chrome Hearts",
        category: "Commercial",
        year: "2023",
        thumbnail: "https://placehold.co/1920x1080/333/FFF?text=Chrome+Hearts",
        slug: "chrome-hearts",
    },
    {
        id: "5",
        title: "Void Runner",
        category: "Spec",
        year: "2025",
        thumbnail: "https://placehold.co/1920x1080/000/FFF?text=Void+Runner",
        slug: "void-runner",
    },
    {
        id: "6",
        title: "After Hours",
        category: "Music Video",
        year: "2023",
        thumbnail: "https://placehold.co/1920x1080/222/FFF?text=After+Hours",
        slug: "after-hours",
    },
];
