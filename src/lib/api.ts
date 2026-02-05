// Client-side API helpers for calling Cloud Functions

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function getProjects() {
    const res = await fetch(`${API_URL}/api/getProjects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

export async function getProjectBySlug(slug: string) {
    const projects = await getProjects();
    return projects.find((p: any) => p.slug === slug);
}

export async function createProject(formData: FormData) {
    const res = await fetch(`${API_URL}/api/createProject`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
}

export async function updateProject(slug: string, formData: FormData) {
    const res = await fetch(`${API_URL}/api/updateProject`, {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
}

export async function deleteProject(slug: string) {
    const res = await fetch(`${API_URL}/api/deleteProject`, {
        method: 'DELETE',
        body: JSON.stringify({ slug }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
}

export async function getSiteSettings() {
    const res = await fetch(`${API_URL}/api/getSettings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
}

export async function updateHeroVideo(formData: FormData) {
    const res = await fetch(`${API_URL}/api/updateSettings`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
}
