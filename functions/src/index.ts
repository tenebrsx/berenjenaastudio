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

// Write endpoints (createProject, updateProject, deleteProject, updateSettings,
// initializeWhitelist) were removed: they had no auth check, bypassed Firestore
// rules via the Admin SDK, and had no callers. The admin UI writes to Firestore
// directly and is protected by firestore.rules.
export { optimizeProjectPreview } from "./previews";
