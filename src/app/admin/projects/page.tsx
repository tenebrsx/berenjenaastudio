"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Grid3x3,
    List,
    Film,
    Calendar,
    Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail: string;
    description?: string;
    createdAt?: string;
}

type ViewMode = "grid" | "list";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const router = useRouter();

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

    // Filter projects based on search and category
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categories = ["all", ...Array.from(new Set(projects.map(p => p.category)))];

    return (
        <ProtectedRoute>
            <AdminLayout>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-white">Proyectos</h1>
                            <p className="text-zinc-400 mt-1">
                                {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}
                                {categoryFilter !== "all" && ` en ${categoryFilter}`}
                            </p>
                        </div>
                        <Link href="/admin/new">
                            <Button size="lg" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nuevo Proyecto
                            </Button>
                        </Link>
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar proyectos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Category Filter */}
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="h-10 rounded-md border border-zinc-700 bg-zinc-900 text-white px-3 py-2 text-sm ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8562] focus-visible:ring-offset-2"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === "all" ? "Todas las Categorías" : cat}
                                    </option>
                                ))}
                            </select>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 border border-zinc-700 rounded-md p-1 bg-zinc-900">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={cn(
                                        "p-2 rounded hover:bg-zinc-800 transition-colors",
                                        viewMode === "grid" && "bg-[#FF8562] text-white hover:bg-[#ff9575]"
                                    )}
                                    title="Vista de cuadrícula"
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "p-2 rounded hover:bg-zinc-800 transition-colors",
                                        viewMode === "list" && "bg-[#FF8562] text-white hover:bg-[#ff9575]"
                                    )}
                                    title="Vista de lista"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className={cn(
                        "grid gap-6",
                        viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                    )}>
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-video bg-zinc-800 animate-pulse" />
                                <CardHeader>
                                    <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <Film className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">
                                {searchQuery || categoryFilter !== "all"
                                    ? "No se encontraron proyectos"
                                    : "Aún no hay proyectos"}
                            </h3>
                            <p className="text-zinc-400 mb-6">
                                {searchQuery || categoryFilter !== "all"
                                    ? "Intenta ajustar tu búsqueda o filtros"
                                    : "Comienza creando tu primer proyecto"}
                            </p>
                            {!searchQuery && categoryFilter === "all" && (
                                <Link href="/admin/new">
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Crear Proyecto
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                ) : viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="overflow-hidden group hover:shadow-lg transition-shadow bg-zinc-900/50 border-white/5">
                                {/* Thumbnail */}
                                <div className="aspect-video bg-zinc-800/50 overflow-hidden relative">
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>

                                {/* Content */}
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <Tag className="h-3 w-3" />
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF8562] text-white">
                                            {project.category}
                                        </span>
                                    </div>

                                    {project.description && (
                                        <CardDescription className="mt-2 line-clamp-2">
                                            {project.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>

                                {/* Actions */}
                                <CardContent className="pt-0 flex gap-2">
                                    <Link href={`/project?slug=${project.slug}`} target="_blank" className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full text-xs">
                                            Ver
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/edit?id=${project.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                                            <Edit2 className="h-3 w-3" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(project.slug)}
                                        className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="space-y-3">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="hover:shadow-md transition-shadow bg-zinc-900/50 border-white/5">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnail */}
                                        <div className="w-32 h-20 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={project.thumbnail}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-white truncate">{project.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FF8562] text-white">
                                                            {project.category}
                                                        </span>
                                                        <span className="text-xs text-zinc-400">
                                                            {project.slug}
                                                        </span>
                                                    </div>
                                                    {project.description && (
                                                        <p className="text-sm text-zinc-300 mt-2 line-clamp-1">
                                                            {project.description}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <Link href={`/project?slug=${project.slug}`} target="_blank">
                                                        <Button variant="outline" size="sm" className="text-xs">
                                                            Ver
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/edit?id=${project.id}`}>
                                                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                                            <Edit2 className="h-3 w-3" />
                                                            Editar
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(project.slug)}
                                                        className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-xs"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </AdminLayout>
        </ProtectedRoute>
    );
}
