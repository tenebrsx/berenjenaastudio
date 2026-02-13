"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Check, Smartphone, Monitor, X, Image as ImageIcon, Plus } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import MediaUpload from "@/components/admin/MediaUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail: string;
    thumbnailPoster?: string;
    description?: string;
    videoUrl?: string;
    credits?: { role: string; name: string }[];
    gallery?: string[];
}

function EditContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [project, setProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category: "",
        thumbnail: "",
        thumbnailPoster: "",
        videoUrl: "",
        credits: [] as { role: string; name: string }[],
        gallery: [] as string[],
    });

    // Temp state for new gallery image input
    const [newGalleryImage, setNewGalleryImage] = useState("");

    const suggestedCategories = ["Commercial", "Music Video", "Narrative", "Spec"];

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        if (!projectId) return;
        try {
            const docRef = doc(db, "projects", projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const found = { id: docSnap.id, ...docSnap.data() } as Project;
                setProject(found);
                setFormData({
                    title: found.title,
                    slug: found.slug,
                    description: found.description || "",
                    category: found.category,
                    thumbnail: found.thumbnail,
                    thumbnailPoster: found.thumbnailPoster || "",
                    videoUrl: found.videoUrl || "",
                    credits: found.credits || [],
                    gallery: found.gallery || [],
                });
            } else {
                console.error("No such project!");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setFetching(false);
        }
    };

    // Add gallery images
    const addGalleryImages = (urls: string[]) => {
        if (!urls.length) return;
        setFormData(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), ...urls]
        }));
    };

    // Remove gallery image
    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    // Add Credit
    const addCredit = () => {
        setFormData(prev => ({
            ...prev,
            credits: [...prev.credits, { role: "", name: "" }]
        }));
    };

    // Update Credit
    const updateCredit = (index: number, field: "role" | "name", value: string) => {
        const newCredits = [...formData.credits];
        newCredits[index][field] = value;
        setFormData(prev => ({ ...prev, credits: newCredits }));
    };

    // Remove Credit
    const removeCredit = (index: number) => {
        setFormData(prev => ({
            ...prev,
            credits: prev.credits.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project || !projectId) return;
        setLoading(true);

        try {
            const docRef = doc(db, "projects", projectId);
            await updateDoc(docRef, {
                ...formData,
                updatedAt: serverTimestamp(),
            });

            router.push("/admin");
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Error updating project");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6 lg:gap-0 lg:-m-8">
                    {/* Left: Editor (Scrollable) */}
                    <div className="flex-1 lg:max-w-xl xl:max-w-2xl lg:border-r border-white/10 lg:h-full lg:overflow-y-auto p-6 lg:p-10 bg-black">
                        <div className="max-w-md mx-auto space-y-8">
                            {/* Header */}
                            <div>
                                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-6">
                                    <ArrowLeft className="h-4 w-4" />
                                    Volver al Panel
                                </Link>
                                <h1 className="text-3xl font-bold tracking-tight text-white">Editar Proyecto</h1>
                                <p className="text-zinc-400 mt-2">Editando "{project.title}". Los cambios se reflejan en la vista previa.</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-zinc-300">Título del Proyecto</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="h-12 text-lg bg-zinc-900/50 border-zinc-800 focus:border-orange-500/50 transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug" className="text-zinc-300">URL Slug</Label>
                                        <div className="relative">
                                            <Input
                                                id="slug"
                                                value={project.slug}
                                                disabled
                                                className="bg-zinc-900/50 border-zinc-800 text-zinc-500 font-mono text-sm cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-600">Los slugs no se pueden cambiar después de la creación.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category" className="text-zinc-300">Categoría</Label>
                                        <div className="relative">
                                            <Input
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                                list="category-suggestions-edit"
                                                className="bg-zinc-900/50 border-zinc-800"
                                            />
                                            <datalist id="category-suggestions-edit">
                                                {suggestedCategories.map(cat => (
                                                    <option key={cat} value={cat} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {suggestedCategories.map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                                                    className={`text-xs px-3 py-1 rounded-full border transition-all ${formData.category === cat
                                                        ? "bg-orange-500 text-white border-orange-500"
                                                        : "border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-300">Imagen/Video Principal (Soporta MP4/GIF)</Label>
                                            <MediaUpload
                                                value={formData.thumbnail}
                                                onChange={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                                                folder="thumbnails"
                                                label="Subir Thumbnail (MP4, GIF, JPG)"
                                            />
                                        </div>

                                        {/* Optional Poster for Videos */}
                                        {formData.thumbnail && (formData.thumbnail.includes(".mp4") || formData.thumbnail.includes(".webm")) && (
                                            <div className="space-y-2 pl-4 border-l-2 border-orange-500/20">
                                                <Label className="text-zinc-300">Imagen de Portada (Poster)</Label>
                                                <p className="text-xs text-zinc-500 mb-2">Se muestra mientras carga el video. Recomendado.</p>
                                                <MediaUpload
                                                    value={formData.thumbnailPoster}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, thumbnailPoster: url }))}
                                                    folder="thumbnails"
                                                    label="Subir Imagen Estática (JPG/PNG)"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-zinc-300">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            className="resize-none bg-zinc-900/50 border-zinc-800 focus:border-orange-500/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Imágenes de la Galería</Label>

                                        <MultiImageUpload
                                            onUpload={addGalleryImages}
                                            label="Arrastra imágenes aquí o haz click"
                                            folder="gallery"
                                        />

                                        <div className="space-y-2 mt-4">
                                            <Reorder.Group
                                                axis="y"
                                                values={formData.gallery || []}
                                                onReorder={(newOrder: string[]) => setFormData(prev => ({ ...prev, gallery: newOrder }))}
                                                className="space-y-2"
                                            >
                                                {formData.gallery?.map((url, idx) => (
                                                    <Reorder.Item
                                                        key={url}
                                                        value={url}
                                                        className="flex items-center gap-2 p-2 bg-zinc-900 rounded border border-zinc-800 group cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="h-10 w-16 bg-zinc-800 rounded overflow-hidden shrink-0 relative">
                                                            <img src={url} alt="" className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-zinc-500 truncate">{url.split('/').pop()?.split('?')[0] || url}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent drag start interference if clicked
                                                                removeGalleryImage(idx);
                                                            }}
                                                            className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 transition-colors rounded"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>

                                            {(!formData.gallery || formData.gallery.length === 0) && (
                                                <p className="text-xs text-zinc-500 italic text-center py-4 border border-zinc-800 border-dashed rounded">
                                                    Aún no hay imágenes en la galería
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="videoUrl" className="text-zinc-300">Enlace de Video (Opcional)</Label>
                                        <Input
                                            id="videoUrl"
                                            name="videoUrl"
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={handleChange}
                                            placeholder="YouTube / Vimeo URL"
                                            className="bg-zinc-900/50 border-zinc-800"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-zinc-300">Créditos</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addCredit}
                                                className="border-zinc-800 bg-transparent text-zinc-400 hover:text-white"
                                            >
                                                <Smartphone className="h-4 w-4 mr-2 hidden" /> {/* Dummy icon to fix import if needed, but we use Plus */}
                                                Añadir Crédito
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {formData.credits.map((credit, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <Input
                                                        placeholder="Rol (ej. Director)"
                                                        value={credit.role}
                                                        onChange={(e) => updateCredit(idx, "role", e.target.value)}
                                                        className="bg-zinc-900/50 border-zinc-800 flex-1"
                                                    />
                                                    <Input
                                                        placeholder="Nombre"
                                                        value={credit.name}
                                                        onChange={(e) => updateCredit(idx, "name", e.target.value)}
                                                        className="bg-zinc-900/50 border-zinc-800 flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeCredit(idx)}
                                                        className="text-zinc-500 hover:text-red-400"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {formData.credits.length === 0 && (
                                                <p className="text-xs text-zinc-600 italic">No hay créditos añadidos</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-4">
                                    <Button type="submit" disabled={loading} size="lg" className="flex-1 text-base font-semibold shadow-xl shadow-orange-900/20">
                                        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        {loading ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                    <Link href="/admin">
                                        <Button type="button" variant="outline" size="lg" className="border-zinc-800 bg-transparent text-zinc-400 hover:text-white">
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Live Preview (Fixed) */}
                    <div className="hidden lg:flex flex-1 bg-zinc-950 items-center justify-center p-8 relative overflow-hidden">
                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }} />

                        <div className="relative z-10 w-full max-w-2xl flex flex-col h-full max-h-[800px]">
                            {/* Device Controls */}
                            <div className="bg-zinc-900/80 backdrop-blur-md rounded-t-xl border border-white/10 p-3 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/20" />
                                </div>
                                <div className="flex gap-1 bg-black/50 p-1 rounded-lg">
                                    <button
                                        onClick={() => setPreviewMode("desktop")}
                                        className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                                    >
                                        <Monitor className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode("mobile")}
                                        className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                                    >
                                        <Smartphone className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Device Frame */}
                            <div className={`
                                bg-black border-x border-b border-white/10 shadow-2xl transition-all duration-500 ease-in-out flex-1 overflow-hidden relative
                                ${previewMode === "mobile" ? "max-w-[375px] mx-auto rounded-b-3xl border-b-8 border-b-zinc-900" : "w-full rounded-b-xl"}
                            `}>
                                {/* Mock Site Content */}
                                <div className="h-full overflow-y-auto bg-black text-white">
                                    {/* Mock Header */}
                                    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-black/80 backdrop-blur z-20">
                                        <div className="text-sm font-bold uppercase tracking-widest">Berenjena</div>
                                        <div className="h-4 w-4 rounded-full border border-white/50" />
                                    </div>

                                    {/* Mock Hero Project */}
                                    <div className="p-6 space-y-6">
                                        <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative group">
                                            {formData.thumbnail ? (
                                                formData.thumbnail.includes(".mp4") || formData.thumbnail.includes(".webm") ? (
                                                    <video
                                                        src={formData.thumbnail}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        loop
                                                        playsInline
                                                        // Auto-play in preview
                                                        autoPlay
                                                    />
                                                ) : (
                                                    <img
                                                        src={formData.thumbnail}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                )
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                                                    <div className="h-10 w-10 border-2 border-dashed border-zinc-800 rounded flex items-center justify-center">
                                                        <span className="text-xs">IMG</span>
                                                    </div>
                                                    <span className="text-xs">No image provided</span>
                                                </div>
                                            )}

                                            {/* Hover info overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-sm font-medium tracking-widest uppercase text-white border border-white px-4 py-2">
                                                    Ver Proyecto
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h1 className="text-2xl md:text-4xl font-bold uppercase leading-none">
                                                    {formData.title || "Proyecto Sin Título"}
                                                </h1>
                                                <span className="text-xs border border-white/20 px-2 py-1 rounded-full text-zinc-400">
                                                    {formData.category || "Sin Categoría"}
                                                </span>
                                            </div>

                                            {formData.description ? (
                                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
                                                    {formData.description}
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="h-2 w-full bg-zinc-900 rounded animate-pulse" />
                                                    <div className="h-2 w-2/3 bg-zinc-900 rounded animate-pulse" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gallery Preview */}
                                        {formData.gallery && formData.gallery.length > 0 && (
                                            <div className="space-y-4 pt-6 border-t border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="h-4 w-4 text-zinc-500" />
                                                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Vista Previa de Galería</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {formData.gallery.map((url, i) => (
                                                        <div key={i} className="aspect=[4/5] bg-zinc-900 rounded overflow-hidden">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            </div>
        }>
            <EditContent />
        </Suspense>
    );
}
