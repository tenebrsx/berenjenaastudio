import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// GET /api/projects - Get all projects
export const getProjects = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
        const projects = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

// POST /api/projects - Create project
export const createProject = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const { title, slug, description, category, thumbnail } = req.body;

        const newProject = {
            title,
            slug,
            description,
            thumbnail,
            category,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection("projects").add(newProject);
        res.json({ id: docRef.id, ...newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Failed to create project" });
    }
});

// PUT /api/projects/:slug - Update project
export const updateProject = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method !== "PUT") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const slug = req.path.split("/").pop();
        const { title, description, category } = req.body;

        const snapshot = await db
            .collection("projects")
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            res.status(404).json({ error: "Project not found" });
            return;
        }

        await snapshot.docs[0].ref.update({ title, description, category });
        res.json({ success: true });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Failed to update project" });
    }
});

// DELETE /api/projects/:slug - Delete project
export const deleteProject = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method !== "DELETE") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const slug = req.path.split("/").pop();

        const snapshot = await db
            .collection("projects")
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            res.status(404).json({ error: "Project not found" });
            return;
        }

        await snapshot.docs[0].ref.delete();
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

// GET /api/settings - Get settings
export const getSettings = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const doc = await db.collection("settings").doc("default").get();

        if (!doc.exists) {
            const defaultSettings = {
                heroVideoUrl: "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4",
            };
            await db.collection("settings").doc("default").set(defaultSettings);
            res.json(defaultSettings);
            return;
        }

        res.json(doc.data());
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});

// POST /api/settings - Update settings
export const updateSettings = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const { heroVideoUrl } = req.body;

        await db.collection("settings").doc("default").set(
            { heroVideoUrl },
            { merge: true }
        );

        res.json({ success: true, heroVideoUrl });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// Initialize whitelist
export const initializeWhitelist = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const email = "tenebrsx@gmail.com";
    try {
        await db.collection('whitelist').doc(email).set({
            email: email,
            role: "admin",
            addedDate: admin.firestore.FieldValue.serverTimestamp(),
            active: true
        });
        res.json({ success: true, message: `Whitelist initialized with ${email}` });
    } catch (error) {
        console.error("Error initializing whitelist:", error);
        res.status(500).json({ error: "Failed to initialize whitelist" });
    }
});
