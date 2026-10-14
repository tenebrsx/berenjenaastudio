// Copies optimized preview videos + posters (Storage previews/) into the static build so
// they are served from the site's own domain (Firebase Hosting CDN). Some networks block or
// break firebasestorage.googleapis.com; the site's own origin is what the visitor already
// reached. Writes src/data/media-map.json: { "<storage url>": "/previews/<file>" }.
import fs from "fs";
import path from "path";

const root = process.cwd();
const projects = JSON.parse(fs.readFileSync(path.join(root, "src/data/projects-build.json"), "utf8"));
const outDir = path.join(root, "public", "previews");
fs.mkdirSync(outDir, { recursive: true });
const map = {};

for (const p of projects) {
    for (const key of ["thumbnail", "thumbnailPoster"]) {
        const url = p[key];
        if (typeof url !== "string") continue;
        const m = url.match(/\/o\/(previews%2F[^?]+)/);
        if (!m) continue; // only optimized previews (small); originals stay remote
        const file = decodeURIComponent(m[1]).replace(/^previews\//, "").replace(/[^A-Za-z0-9._-]/g, "_");
        const dest = path.join(outDir, file);
        try {
            if (!fs.existsSync(dest)) {
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
            }
            map[url.split("?")[0]] = `/previews/${file}`;
        } catch (e) {
            console.warn(`mirror-media: skipped ${file}: ${e}`); // falls back to the Storage URL
        }
    }
}
fs.writeFileSync(path.join(root, "src/data/media-map.json"), JSON.stringify(map, null, 2));
console.log(`mirror-media: ${Object.keys(map).length} files served from /previews`);
