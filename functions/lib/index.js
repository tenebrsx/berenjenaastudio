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
exports.optimizeProjectPreview = exports.getSettings = exports.getProjects = void 0;
const functions = __importStar(require("firebase-functions/v2/https"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// GET /api/projects - Get all projects
exports.getProjects = functions.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
        const projects = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.json(projects);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});
// GET /api/settings - Get settings
exports.getSettings = functions.onRequest(async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
});
// Write endpoints (createProject, updateProject, deleteProject, updateSettings,
// initializeWhitelist) were removed: they had no auth check, bypassed Firestore
// rules via the Admin SDK, and had no callers. The admin UI writes to Firestore
// directly and is protected by firestore.rules.
var previews_1 = require("./previews");
Object.defineProperty(exports, "optimizeProjectPreview", { enumerable: true, get: function () { return previews_1.optimizeProjectPreview; } });
//# sourceMappingURL=index.js.map