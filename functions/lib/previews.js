"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeProjectPreview = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const logger = __importStar(require("firebase-functions/logger"));
const admin = __importStar(require("firebase-admin"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const crypto_1 = require("crypto");
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath = require("ffmpeg-static");
const run = (0, util_1.promisify)(child_process_1.execFile);
const CACHE = "public, max-age=31536000, immutable";
// Storage object path from a Firebase download URL, or null if not ours.
function storagePath(url, bucket) {
    const m = url.match(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/([^/]+)\/o\/([^?]+)/);
    if (!m || m[1] !== bucket)
        return null;
    return decodeURIComponent(m[2]);
}
function downloadUrl(bucket, p, token) {
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
exports.optimizeProjectPreview = (0, firestore_1.onDocumentWritten)({ document: "projects/{id}", region: "us-central1", memory: "2GiB", cpu: 2, timeoutSeconds: 540, maxInstances: 3 }, async (event) => {
    var _a;
    const after = (_a = event.data) === null || _a === void 0 ? void 0 : _a.after;
    if (!(after === null || after === void 0 ? void 0 : after.exists))
        return;
    const data = after.data();
    const thumb = typeof data.thumbnail === "string" ? data.thumbnail : "";
    const bucket = admin.storage().bucket();
    const src = storagePath(thumb, bucket.name);
    if (!src || src.startsWith("previews/"))
        return;
    if (!/\.(mp4|mov|webm|m4v)$/i.test(src))
        return;
    if (data.previewFailedFor === thumb)
        return; // don't retry a known failure forever
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
            "-b:v", "2M", "-maxrate", "2.5M", "-bufsize", "4M", "-movflags", "+faststart", outFile], { maxBuffer: 1 << 24 });
        await run(ffmpegPath, ["-nostdin", "-y", "-v", "error", "-ss", "0.5", "-t", "3", "-i", outFile,
            "-vf", "thumbnail=60", "-frames:v", "1", "-c:v", "libwebp", "-quality", "72", posterFile]);
        const base = path.basename(src).replace(/\.[^.]+$/, "");
        const stamp = Date.now();
        const vPath = `previews/${stamp}-${base}-720p.mp4`;
        const pPath = `previews/${stamp}-${base}-poster.webp`;
        const vTok = (0, crypto_1.randomUUID)(), pTok = (0, crypto_1.randomUUID)();
        await bucket.upload(outFile, { destination: vPath, metadata: { contentType: "video/mp4", cacheControl: CACHE, metadata: { firebaseStorageDownloadTokens: vTok, source: src } } });
        await bucket.upload(posterFile, { destination: pPath, metadata: { contentType: "image/webp", cacheControl: CACHE, metadata: { firebaseStorageDownloadTokens: pTok, source: src } } });
        // Only swap if the thumbnail wasn't changed while we were encoding.
        await admin.firestore().runTransaction(async (tx) => {
            var _a;
            const cur = await tx.get(after.ref);
            if (cur.get("thumbnail") !== thumb)
                return;
            tx.update(after.ref, {
                thumbnail: downloadUrl(bucket.name, vPath, vTok),
                thumbnailPoster: downloadUrl(bucket.name, pPath, pTok),
                thumbnailOriginal: thumb,
                thumbnailPosterOriginal: (_a = cur.get("thumbnailPoster")) !== null && _a !== void 0 ? _a : null,
            });
        });
        logger.info("Preview optimized", { id: event.params.id, src, vPath });
    }
    catch (err) {
        logger.error("Preview optimization failed; keeping original", { id: event.params.id, src, err: String(err) });
        await after.ref.update({ previewFailedFor: thumb }).catch(() => undefined);
    }
    finally {
        await fs.rm(tmp, { recursive: true, force: true });
    }
});
//# sourceMappingURL=previews.js.map