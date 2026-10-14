import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { execFile } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath: string = require("ffmpeg-static");
const run = promisify(execFile);

const CACHE = "public, max-age=31536000, immutable";

// Storage object path from a Firebase download URL, or null if not ours.
function storagePath(url: string, bucket: string): string | null {
    const m = url.match(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/);
    if (!m || m[1] !== bucket) return null;
    return decodeURIComponent(m[2]);
}

function downloadUrl(bucket: string, p: string, token: string) {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(p)}?alt=media&token=${token}`;
}

/**
 * When a project's `thumbnail` points at an uploaded master MP4/MOV/WebM, generate a
 * lightweight looping preview (720p H.264 High, ~2 Mbps, no audio, faststart) and a
 * WebP poster, upload them under previews/ (originals are never touched), and swap the
 * project's fields. Originals are kept in thumbnailOriginal / thumbnailPosterOriginal.
 * Runs after the admin save, so the existing upload flow is unchanged; if anything
 * fails the project simply keeps its original video.
 */
export const optimizeProjectPreview = onDocumentWritten(
    { document: "projects/{id}", region: "us-central1", memory: "2GiB", cpu: 2, timeoutSeconds: 540, maxInstances: 3 },
    async (event) => {
        const after = event.data?.after;
        if (!after?.exists) return;
        const data = after.data() as Record<string, unknown>;
        const thumb = typeof data.thumbnail === "string" ? data.thumbnail : "";
        const bucket = admin.storage().bucket();
        const src = storagePath(thumb, bucket.name);
        if (!src || src.startsWith("previews/")) return;
        if (!/\.(mp4|mov|webm|m4v)$/i.test(src)) return;
        if (data.previewFailedFor === thumb) return; // don't retry a known failure forever

        const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "prev-"));
        const inFile = path.join(tmp, "in");
        const outFile = path.join(tmp, "out.mp4");
        const posterFile = path.join(tmp, "poster.webp");
        try {
            await bucket.file(src).download({ destination: inFile });
            // Keep orientation: limit the short side to 720px; never upscale.
            const vf = "scale='if(gt(iw,ih),-2,min(720,iw))':'if(gt(iw,ih),min(720,ih),-2)',fps=30,format=yuv420p";
            await run(ffmpegPath, ["-nostdin", "-y", "-v", "error", "-i", inFile, "-an", "-vf", vf,
                "-c:v", "libx264", "-profile:v", "high", "-preset", "medium",
                "-b:v", "2M", "-maxrate", "2.5M", "-bufsize", "4M", "-movflags", "+faststart", outFile],
                { maxBuffer: 1 << 24 });
            await run(ffmpegPath, ["-nostdin", "-y", "-v", "error", "-ss", "0.5", "-t", "3", "-i", outFile,
                "-vf", "thumbnail=60", "-frames:v", "1", "-c:v", "libwebp", "-quality", "72", posterFile]);

            const base = path.basename(src).replace(/\.[^.]+$/, "");
            const stamp = Date.now();
            const vPath = `previews/${stamp}-${base}-720p.mp4`;
            const pPath = `previews/${stamp}-${base}-poster.webp`;
            const vTok = randomUUID(), pTok = randomUUID();
            await bucket.upload(outFile, { destination: vPath, metadata: { contentType: "video/mp4", cacheControl: CACHE, metadata: { firebaseStorageDownloadTokens: vTok, source: src } } });
            await bucket.upload(posterFile, { destination: pPath, metadata: { contentType: "image/webp", cacheControl: CACHE, metadata: { firebaseStorageDownloadTokens: pTok, source: src } } });

            // Only swap if the thumbnail wasn't changed while we were encoding.
            await admin.firestore().runTransaction(async (tx) => {
                const cur = await tx.get(after.ref);
                if (cur.get("thumbnail") !== thumb) return;
                tx.update(after.ref, {
                    thumbnail: downloadUrl(bucket.name, vPath, vTok),
                    thumbnailPoster: downloadUrl(bucket.name, pPath, pTok),
                    thumbnailOriginal: thumb,
                    thumbnailPosterOriginal: cur.get("thumbnailPoster") ?? null,
                });
            });
            logger.info("Preview optimized", { id: event.params.id, src, vPath });
        } catch (err) {
            logger.error("Preview optimization failed; keeping original", { id: event.params.id, src, err: String(err) });
            await after.ref.update({ previewFailedFor: thumb }).catch(() => undefined);
        } finally {
            await fs.rm(tmp, { recursive: true, force: true });
        }
    }
);
