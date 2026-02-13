"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";

interface MultiImageUploadProps {
    onUpload: (urls: string[]) => void;
    label?: string;
    className?: string;
    folder?: string;
}

export default function MultiImageUpload({
    onUpload,
    label = "Arrastra imágenes o haz click para seleccionar",
    className,
    folder = "gallery"
}: MultiImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0); // Average progress
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        await uploadFiles(Array.from(files));

        // Reset input
        e.target.value = "";
    };

    const uploadFiles = async (files: File[]) => {
        setLoading(true);
        setProgress(0);

        // We can't accurately predict total bytes post-compression beforehand, so we'll just track upload progress

        try {
            const uploadPromises = files.map(async (file) => {
                let fileToUpload = file;

                // Compress if it's an image (but NOT a GIF)
                if (file.type.startsWith("image/") && file.type !== "image/gif") {
                    const options = {
                        maxSizeMB: 0.8, // Slightly more aggressive for gallery
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    try {
                        fileToUpload = await imageCompression(file, options);
                    } catch (error) {
                        console.error("Compression failed for " + file.name, error);
                    }
                }

                return new Promise<string>((resolve, reject) => {
                    const storageRef = ref(storage, `${folder}/${Date.now()}-${fileToUpload.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            // Individual progress tracking could go here
                        },
                        (error) => reject(error),
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve(downloadURL);
                        }
                    );
                });
            });

            const urls = await Promise.all(uploadPromises);
            onUpload(urls);
        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Error al subir algunas imágenes.");
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
        if (files.length > 0) {
            await uploadFiles(files);
        }
    };

    return (
        <div className={cn("", className)}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed border-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group min-h-[160px]",
                    loading ? "opacity-50 pointer-events-none" : "hover:border-orange-500/50 hover:bg-zinc-900/50"
                )}
            >
                {loading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                        <span className="text-sm text-zinc-500 font-mono">
                            Subiendo imágenes...
                        </span>
                    </div>
                ) : (
                    <>
                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-orange-500/10">
                            <Upload className="h-6 w-6 text-zinc-500 group-hover:text-orange-500" />
                        </div>
                        <div className="text-center">
                            <span className="text-sm text-zinc-300 font-medium block">
                                {label}
                            </span>
                            <span className="text-xs text-zinc-500 mt-1 block">
                                Soporta JPG, PNG, GIF, WebP
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
