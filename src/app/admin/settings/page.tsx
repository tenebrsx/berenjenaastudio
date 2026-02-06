"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [heroVideoUrl, setHeroVideoUrl] = useState("");
    const [videoPreview, setVideoPreview] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("https://getsettings-ie4kq7otea-uc.a.run.app");
            const data = await res.json();
            setHeroVideoUrl(data.heroVideoUrl || "");
            setVideoPreview(data.heroVideoUrl || "");
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("https://updatesettings-ie4kq7otea-uc.a.run.app", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ heroVideoUrl }),
            });

            if (res.ok) {
                setVideoPreview(heroVideoUrl);
                alert("¡Configuración actualizada con éxito!");
            } else {
                alert("Error al actualizar configuración");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar configuración");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#FF8562] mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Panel
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight text-white">Configuración</h1>
                    <p className="text-zinc-400 mt-1">Configura los ajustes de tu sitio</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Video Principal</CardTitle>
                                <CardDescription>El video que se reproduce en la página de inicio</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="heroVideo">URL del Video</Label>
                                        <Input
                                            id="heroVideo"
                                            type="url"
                                            value={heroVideoUrl}
                                            onChange={(e) => setHeroVideoUrl(e.target.value)}
                                            placeholder="https://videos.pexels.com/..."
                                            className="text-base"
                                        />
                                        <p className="text-xs text-zinc-400">Pega un enlace directo al video</p>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="submit" disabled={loading} className="gap-2">
                                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {loading ? "Guardando..." : "Guardar Cambios"}
                                        </Button>
                                        <Link href="/admin">
                                            <Button type="button" variant="outline">
                                                Cancelar
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Vista Previa</CardTitle>
                                <CardDescription>Cómo aparecerá en la página de inicio</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                                    {videoPreview ? (
                                        <video
                                            src={videoPreview}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">
                                            Vista previa del video
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
