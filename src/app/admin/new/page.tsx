"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { slugify } from "@/lib/utils";

export default function NewProjectPage() {
    const [loading, setLoading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category: "Commercial",
        thumbnail: "",
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/createProject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin");
            } else {
                alert("Error al crear proyecto");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al crear proyecto");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title
        if (name === "title") {
            const slug = slugify(value);
            setFormData(prev => ({ ...prev, slug }));
        }

        // Preview thumbnail
        if (name === "thumbnail") {
            setThumbnailPreview(value);
        }
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Nuevo Proyecto</h1>
                    <p className="text-zinc-600 mt-1">Crear una nueva pieza de portafolio</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Proyecto</CardTitle>
                                <CardDescription>Completa la información a continuación</CardDescription>
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
                                            placeholder="Midnight Echo"
                                            className="text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug *</Label>
                                        <div className="relative">
                                            <Input
                                                id="slug"
                                                name="slug"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                required
                                                placeholder="midnight-echo"
                                                className="text-base pr-8"
                                            />
                                            {formData.slug && (
                                                <Check className="absolute right-3 top-3 h-4 w-4 text-green-600" />
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500">Generado automáticamente del título</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoría *</Label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
                                        >
                                            <option value="Commercial">Commercial</option>
                                            <option value="Music Video">Music Video</option>
                                            <option value="Narrative">Narrative</option>
                                            <option value="Spec">Spec</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="thumbnail">URL de Miniatura *</Label>
                                        <Input
                                            id="thumbnail"
                                            name="thumbnail"
                                            type="url"
                                            value={formData.thumbnail}
                                            onChange={handleChange}
                                            required
                                            placeholder="https://images.unsplash.com/..."
                                            className="text-base"
                                        />
                                        <p className="text-xs text-zinc-500">La vista previa aparecerá a la derecha</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="A cinematic exploration of..."
                                            className="resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" disabled={loading} className="flex-1 gap-2">
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {loading ? "Creando..." : "Crear Proyecto"}
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

                    {/* Live Preview */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vista Previa</CardTitle>
                                <CardDescription>Cómo aparecerá tu proyecto</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Card Preview */}
                                    <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                        <div className="aspect-video bg-zinc-100">
                                            {thumbnailPreview ? (
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={() => setThumbnailPreview("")}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                                                    Vista previa de miniatura
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg truncate">
                                                {formData.title || "Título del Proyecto"}
                                            </h3>
                                            <p className="text-sm text-zinc-600 mt-1">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-zinc-100">
                                                    {formData.category}
                                                </span>
                                            </p>
                                            {formData.description && (
                                                <p className="text-sm text-zinc-600 mt-3 line-clamp-2">
                                                    {formData.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* URL Preview */}
                                    {formData.slug && (
                                        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
                                            <p className="text-xs text-zinc-500 mb-1">URL Pública</p>
                                            <code className="text-sm text-zinc-900 break-all">
                                                /work/{formData.slug}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
