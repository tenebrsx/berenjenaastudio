import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

const firebaseAdminConfig = {
    credential: serviceAccount ? cert(serviceAccount) : undefined,
    // If no service account is provided (e.g. during build or simple dev),
    // it will try Application Default Credentials or just work for public data if rules allow? 
    // Actually Admin SDK always needs privs. 
    // In Cloud Functions, it auto-initializes without args.
};

// Check if we are running in a Cloud Function (which handles its own auth usually)
// or local dev.
if (!getApps().length) {
    // If we're deploying to basic Firebase Hosting + Functions, 
    // simply initializing without args often works best in the cloud environment (Auto-discovery).
    // Locally, we might need a service account if we want to write data.
    if (process.env.NODE_ENV === 'production') {
        initializeApp();
    } else {
        // Local dev: try to use service account if available, or just init (might fail on write)
        if (serviceAccount) {
            initializeApp({
                credential: cert(serviceAccount),
                projectId: "berenjenastudiofinal" // Explicitly set project ID if needed
            });
        } else {
            // Attempt auto-init (works if GOOGLE_APPLICATION_CREDENTIALS is set)
            initializeApp({
                projectId: "berenjenastudiofinal"
            });
        }
    }
}

export const db = getFirestore();
export const storage = getStorage();
