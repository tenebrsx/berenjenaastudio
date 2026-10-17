"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** The admin opens straight to Proyectos. */
export default function AdminIndex() {
    const router = useRouter();
    useEffect(() => {
        router.replace("/admin/projects");
    }, [router]);
    return null;
}
