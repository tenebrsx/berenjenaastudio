"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { buildProjects, cleanSlug } from "@/lib/seo";

// Legacy /project?slug=… URLs. Firebase Hosting redirects can't match query strings, so
// projects that have a pre-rendered page are redirected client-side (and this page is
// noindex, with the canonical on /proyectos/<slug>). Projects added after the last build
// still render here from Firestore until the next deploy.
function LegacyProject() {
    const slug = useSearchParams().get("slug");
    const built = slug ? buildProjects().find((p) => p.slug === slug) : undefined;
    useEffect(() => {
        if (built) window.location.replace(`/proyectos/${cleanSlug(built)}`);
    }, [built]);
    if (built) return <div className="min-h-screen bg-black" />;
    return <ProjectDetail slug={slug} />;
}

export default function ProjectPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LegacyProject />
        </Suspense>
    );
}
