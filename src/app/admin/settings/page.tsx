"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import MediaUpload from "@/components/admin/MediaUpload";

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
            const docRef = doc(db, "settings", "general");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setHeroVideoUrl(data.heroVideoUrl || "");
                setVideoPreview(data.heroVideoUrl || "");
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await setDoc(doc(db, "settings", "general"), {
                heroVideoUrl
            }, { merge: true });

            setVideoPreview(heroVideoUrl);
            alert("¡Configuración actualizada con éxito!");
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
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Video Principal</CardTitle>
                                <CardDescription>El video que se reproduce en la página de inicio (MP4 o GIF)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <Label>Archivo de Video</Label>
                                        <MediaUpload
                                            value={heroVideoUrl}
                                            onChange={(url) => {
                                                setHeroVideoUrl(url);
                                                setVideoPreview(url);
                                            }}
                                            folder="settings"
                                        />
                                        <div className="space-y-2">
                                            <Label htmlFor="heroVideo">O ingrese URL manualmente</Label>
                                            <Input
                                                id="heroVideo"
                                                type="url"
                                                value={heroVideoUrl}
                                                onChange={(e) => {
                                                    setHeroVideoUrl(e.target.value);
                                                    setVideoPreview(e.target.value);
                                                }}
                                                placeholder="https://..."
                                                className="text-base"
                                            />
                                        </div>
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
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
