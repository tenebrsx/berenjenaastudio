"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail: string;
    description?: string;
    videoUrl?: string;
}

function EditContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        videoUrl: "",
    });

    // Suggested categories (user can still type their own)
    const suggestedCategories = ["Commercial", "Music Video", "Narrative", "Spec"];

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/getProjects");
            const projects: Project[] = await res.json();
            const found = projects.find(p => p.id === projectId);

            if (found) {
                setProject(found);
                setFormData({
                    title: found.title,
                    description: found.description || "",
                    category: found.category,
                    videoUrl: found.videoUrl || "",
                });
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;

        setLoading(true);

        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/updateProject", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: project.slug, ...formData }),
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                alert("Error al actualizar proyecto");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar proyecto");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#FF8562] mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Editar Proyecto</h1>
                    <p className="text-zinc-400 mt-1">{project.title}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Proyecto</CardTitle>
                                <CardDescription>Actualizar información del proyecto</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Título *</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            className="text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={project.slug}
                                            disabled
                                            className="text-base bg-zinc-50"
                                        />
                                        <p className="text-xs text-zinc-400">No se puede cambiar</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoría *</Label>
                                        <Input
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            placeholder="Escribe o selecciona una categoría"
                                            list="category-suggestions-edit"
                                            className="text-base"
                                        />
                                        <datalist id="category-suggestions-edit">
                                            {suggestedCategories.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                        <p className="text-xs text-zinc-400">Puedes escribir tu propia categoría o seleccionar una sugerida</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl">URL de YouTube (Opcional)</Label>
                                        <Input
                                            id="videoUrl"
                                            name="videoUrl"
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={handleChange}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="text-base"
                                        />
                                        <p className="text-xs text-zinc-400">Agrega un enlace de YouTube si el proyecto tiene video</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" disabled={loading} className="flex-1 gap-2">
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {loading ? "Guardando..." : "Guardar Cambios"}
                                        </Button>
                                        <Link href="/admin" className="flex-1">
                                            <Button type="button" variant="outline" className="w-full">
                                                Cancelar
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Current State */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Proyecto Actual</CardTitle>
                                <CardDescription>Cómo aparece actualmente</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border border-zinc-700 rounded-lg overflow-hidden">
                                    <div className="aspect-video bg-zinc-800">
                                        <img
                                            src={project.thumbnail}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4 bg-zinc-800">
                                        <p className="text-xs text-zinc-400 mb-1">Miniatura actual</p>
                                        <code className="text-xs text-zinc-300 break-all">
                                            {project.thumbnail}
                                        </code>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}

export default function EditProjectPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        }>
            <EditContent />
        </Suspense>
    );
}
