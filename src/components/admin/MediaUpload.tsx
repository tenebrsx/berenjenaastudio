"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";
import imageCompression from "browser-image-compression";

interface MediaUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    label?: string;
    className?: string;
    folder?: string;
}

export default function MediaUpload({
    value,
    onChange,
    onRemove,
    label = "Subir Video/GIF (MP4, GIF)",
    className,
    folder = "settings"
}: MediaUploadProps) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input
        e.target.value = "";

        // Validate file type
        if (!file.type.startsWith("video/") && !file.type.startsWith("image/")) {
            alert("Por favor sube un archivo de video válido (MP4) o una imagen (GIF, JPG, PNG).");
            return;
        }

        try {
            setLoading(true);
            setProgress(0);

            let fileToUpload = file;

            // Compress if it's an image (but NOT a GIF, as compression ruins animation)
            if (file.type.startsWith("image/") && file.type !== "image/gif") {
                console.log(`Original size: ${file.size / 1024 / 1024} MB`);
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };
                try {
                    fileToUpload = await imageCompression(file, options);
                    console.log(`Compressed size: ${fileToUpload.size / 1024 / 1024} MB`);
                } catch (error) {
                    console.error("Compression failed, uploading original:", error);
                }
            }

            // Create reference
            const storageRef = ref(storage, `${folder}/${Date.now()}-${fileToUpload.name}`);
            const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                },
                (error) => {
                    console.error("Upload error:", error);
                    setLoading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    onChange(downloadURL);
                    setLoading(false);
                }
            );
        } catch (error) {
            console.error("Error uploading media:", error);
            setLoading(false);
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/mp4,image/*"
                className="hidden"
            />

            {value ? (
                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 group">
                    {value.includes(".mp4") || value.includes(".webm") ? (
                        <video
                            src={value}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src={value}
                            alt="Media preview"
                            className="h-full w-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2 bg-black/50">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(value, "_blank")}
                            className="h-8 w-8 p-0"
                        >
                            <FileVideo className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onRemove ? onRemove : () => onChange("")}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group aspect-video"
                >
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                            <span className="text-xs text-zinc-500 font-mono">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300" />
                            </div>
                            <span className="text-sm text-zinc-500 font-medium group-hover:text-zinc-300">
                                {label}
                            </span>
                            <span className="text-xs text-zinc-600">
                                Click para seleccionar (MP4, GIF, IMG)
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
