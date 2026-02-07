"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Settings,
    ArrowUpRight,
    Film,
    Video,
    Eye
} from "lucide-react";
import { motion } from "framer-motion";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail: string;
    createdAt?: string;
}

export default function AdminDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Project[];
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                                Panel de Control
                            </h1>
                            <p className="text-zinc-400 max-w-md">
                                Bienvenido a tu centro de mando. Gestiona tu portafolio y la configuración del sitio desde aquí.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/project" target="_blank">
                                <Button variant="secondary" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    Ver Sitio
                                </Button>
                            </Link>
                            <Link href="/admin/new">
                                <Button className="gap-2 shadow-lg shadow-orange-900/20">
                                    <Plus className="h-4 w-4" />
                                    Nuevo Proyecto
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats / Actions */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Total Projects Card */}
                        <motion.div variants={item}>
                            <Card className="h-full bg-zinc-900/50 border-white/5 hover:border-white/10 transition-colors">
                                <CardHeader className="pb-2">
                                    <CardDescription>Total de Proyectos</CardDescription>
                                    <CardTitle className="text-4xl font-light text-white">
                                        {loading ? "..." : projects.length}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-zinc-500">
                                        Piezas activas del portafolio
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Action: New Project */}
                        <motion.div variants={item}>
                            <Link href="/admin/new" className="block h-full">
                                <Card className="h-full bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 hover:border-orange-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardHeader>
                                        <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform">
                                            <Video className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-white group-hover:text-orange-400 transition-colors">Crear Proyecto</CardTitle>
                                        <CardDescription>
                                            Añade un nuevo video o proyecto a tu portafolio
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-end">
                                        <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Quick Action: Settings */}
                        <motion.div variants={item}>
                            <Link href="/admin/settings" className="block h-full">
                                <Card className="h-full bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group">
                                    <CardHeader>
                                        <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400 group-hover:text-white transition-colors">
                                            <Settings className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-white">Configuración del Sitio</CardTitle>
                                        <CardDescription>
                                            Configura el video principal y opciones globales
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-end">
                                        <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Recent Projects List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-xl font-semibold text-white">Proyectos Recientes</h2>
                            <Link href="/admin/projects" className="text-sm text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                                Ver Todos <ArrowUpRight className="h-3 w-3" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-24 rounded-lg bg-zinc-900/50 animate-pulse" />
                                ))}
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                <Film className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                                <p className="text-zinc-500">No se encontraron proyectos</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {projects.slice(0, 5).map((project) => (
                                    <Link key={project.id} href={`/admin/edit?id=${project.id}`}>
                                        <div className="group flex items-center gap-4 p-3 bg-zinc-900/30 border border-white/5 rounded-xl hover:bg-zinc-900 hover:border-white/10 transition-all">
                                            {/* Thumbnail */}
                                            <div className="h-16 w-24 bg-zinc-800 rounded-lg overflow-hidden relative shrink-0 flex items-center justify-center">
                                                {project.thumbnail ? (
                                                    <img
                                                        src={project.thumbnail}
                                                        alt={project.title}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <Film className="h-6 w-6 text-zinc-600" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-zinc-200 group-hover:text-white truncate">
                                                    {project.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                                                        {project.category}
                                                    </span>
                                                    <span className="text-xs text-zinc-600">
                                                        /{project.slug}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Edit Action Icon */}
                                            <div className="px-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                                <span className="text-sm font-medium text-orange-500 flex items-center gap-1">
                                                    Editar <ArrowUpRight className="h-3 w-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
