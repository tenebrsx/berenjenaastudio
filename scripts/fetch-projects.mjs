import fs from 'fs';
import path from 'path';

async function fetchProjects() {
    console.log("Fetching projects for static build...");
    try {
        const res = await fetch("https://us-central1-berenjenastudiofinal.cloudfunctions.net/getProjects");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const projects = await res.json();

        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(dataDir, 'projects-build.json'),
            JSON.stringify(projects, null, 2)
        );
        console.log(`Successfully saved ${projects.length} projects to src/data/projects-build.json`);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Ensure file exists even if empty to avoid build error
        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(path.join(dataDir, 'projects-build.json'), '[]');
        process.exit(1);
    }
}

fetchProjects();
