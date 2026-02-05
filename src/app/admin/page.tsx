"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, Edit2, Trash2, Film } from "lucide-react";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail: string;
    description?: string;
}

export default function AdminDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/getProjects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
            return;
        }

        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/deleteProject", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug }),
            });

            if (res.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    //  Group projects by category
    const projectsByCategory = projects.reduce((acc, project) => {
        if (!acc[project.category]) {
            acc[project.category] = [];
        }
        acc[project.category].push(project);
        return acc;
    }, {} as Record<string, Project[]>);

    return (
        <ProtectedRoute>
            <AdminLayout>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Panel de Control</h1>
                            <p className="text-zinc-600 mt-1">Gestiona tus proyectos de portafolio</p>
                        </div>
                        <Link href="/admin/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nuevo Proyecto
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total de Proyectos</CardDescription>
                            <CardTitle className="text-3xl">{projects.length}</CardTitle>
                        </CardHeader>
                    </Card>

                    {Object.entries(projectsByCategory).map(([category, categoryProjects]) => (
                        <Card key={category}>
                            <CardHeader className="pb-3">
                                <CardDescription>{category}</CardDescription>
                                <CardTitle className="text-3xl">{categoryProjects.length}</CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Projects Grid */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-zinc-900">Todos los Proyectos</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-video bg-zinc-200 animate-pulse" />
                                <CardHeader>
                                    <div className="h-4 bg-zinc-200 rounded animate-pulse" />
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : projects.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <Film className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                            <h3 className="text-lg font-medium text-zinc-900 mb-2">Aún no hay proyectos</h3>
                            <p className="text-zinc-600 mb-6">Comienza creando tu primer proyecto</p>
                            <Link href="/admin/new">
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Crear Proyecto
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                                {/* Thumbnail */}
                                <div className="aspect-video bg-zinc-100 overflow-hidden">
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>

                                {/* Content */}
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                                                    {project.category}
                                                </span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                {/* Actions */}
                                <CardContent className="flex gap-2">
                                    <Link href={`/admin/edit?id=${project.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Edit2 className="h-3.5 w-3.5" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(project.slug)}
                                        className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Eliminar
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
}
