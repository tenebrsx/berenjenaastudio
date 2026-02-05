const admin = require('firebase-admin');

// Initialize with the project ID
// This relies on Application Default Credentials (ADC) being set up on the machine.
try {
    admin.initializeApp({
        projectId: "berenjenastudiofinal"
    });
} catch (e) {
    if (e.code === 'app/duplicate-app') {
        // Ignore if already initialized
    } else {
        console.error("Initialization Error:", e);
    }
}

const db = admin.firestore();

async function bootstrap() {
    const email = "tenebrsx@gmail.com";
    console.log(`Attempting to whitelist: ${email}...`);

    try {
        await db.collection('whitelist').doc(email).set({
            email: email,
            role: "admin",
            addedDate: new Date(),
            active: true
        });
        console.log("✅ SUCCESSS: User whitelisted!");
        console.log("You can now log in at /admin/login");
        process.exit(0);
    } catch (error) {
        console.error("❌ FAILED: Could not write to Firestore.");
        console.error("Error details:", error.message);
        console.log("\nIf this failed due to credentials, please run:");
        console.log("  gcloud auth application-default login");
        console.log("OR manually add the document in Firebase Console.");
        process.exit(1);
    }
}

bootstrap();
