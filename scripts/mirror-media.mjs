// Copies every Firebase Storage file the public site displays into the static build so it is
// served from the site's own domain (Firebase Hosting CDN). Some networks block or break
// firebasestorage.googleapis.com; the site's own origin is what the visitor already reached.
// - previews/ (already optimized videos + WebP posters): copied as-is
// - other images (gallery, stills, posters): converted to WebP, max 1600px wide
// Originals in Storage are never modified. Writes src/data/media-map.json:
//   { "<storage url without query>": "/previews/<file>" | "/media/<file>" }
import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const root = process.cwd();
const projects = JSON.parse(fs.readFileSync(path.join(root, "src/data/projects-build.json"), "utf8"));
const SKIP_KEYS = new Set(["thumbnailOriginal", "thumbnailPosterOriginal", "previewFailedFor"]);
const STORAGE = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?]+)/;
const IMAGE = /\.(jpe?g|png|webp|gif|avif|heic)$/i;
const map = {};

// Collect displayed Storage URLs from any (nested) project field.
const urls = new Set();
const walk = (v, key) => {
    if (SKIP_KEYS.has(key)) return;
    if (typeof v === "string") { if (STORAGE.test(v)) urls.add(v); }
    else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
};
projects.forEach((p) => walk(p, ""));

for (const dir of ["previews", "media"]) fs.mkdirSync(path.join(root, "public", dir), { recursive: true });

let done = 0;
for (const url of urls) {
    const objPath = decodeURIComponent(url.match(STORAGE)[1]);
    const hash = crypto.createHash("sha1").update(objPath).digest("hex").slice(0, 16);
    try {
        let rel;
        if (objPath.startsWith("previews/")) {
            rel = `/previews/${path.basename(objPath).replace(/[^A-Za-z0-9._-]/g, "_")}`;
        } else if (IMAGE.test(objPath) || /\/(gallery|images?|stills?|posters?)\//.test(objPath) || /poster/.test(objPath)) {
            rel = `/media/${hash}.webp`;
        } else {
            continue; // large original videos stay remote
        }
        const dest = path.join(root, "public", rel);
        if (!fs.existsSync(dest)) {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = Buffer.from(await res.arrayBuffer());
            if (rel.startsWith("/media/")) {
                await sharp(buf, { animated: true }).rotate()
                    .resize({ width: 1600, withoutEnlargement: true })
                    .webp({ quality: 78 }).toFile(dest);
            } else {
                fs.writeFileSync(dest, buf);
            }
        }
        map[url.split("?")[0]] = rel;
        done++;
    } catch (e) {
        console.warn(`mirror-media: skipped ${objPath}: ${e}`); // falls back to the Storage URL
    }
}
fs.writeFileSync(path.join(root, "src/data/media-map.json"), JSON.stringify(map, null, 2));
console.log(`mirror-media: ${done}/${urls.size} Storage files served from the site's own domain`);
