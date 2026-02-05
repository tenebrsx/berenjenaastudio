# Deployment Architecture Review

## ⚠️ Critical Compatibility Issues

Your application is currently designed for a **persistent server (VPS)** or **local environment**, but you are deploying to **Firebase Hosting (Serverless)**. This creates two critical issues that will break your app in production:

### 1. SQLite Database (`dev.db`)
- **Use Case:** You are using SQLite with a local file (`file:./dev.db`).
- **Problem:** In a serverless environment (like Firebase Cloud Functions), the filesystem is **ephemeral**. 
    - Every time your app "sleeps" and wakes up, the database file will be reset or lost.
    - Multiple users might hit different server instances, seeing different or missing data.
- **Solution:** You must use a hosted database.
    - **Recommendations:** Neon (Postgres), PlanetScale (MySQL), Supabase, or Turso (SQLite over HTTP).

### 2. Local File Uploads (`public/uploads`)
- **Use Case:** Your `uploadFile` function writes images to `public/uploads` using `fs.writeFile`.
- **Problem:** Serverless functions cannot write to the `public` directory. Even if you write to `/tmp`, the files will be deleted immediately after the request ends.
- **Solution:** You must upload files to an external storage service.
    - **Recommendation:** Firebase Storage, AWS S3, or UploadThing.

## Summary
While `firebase deploy` will now technically "succeed" (upload your code), the app **will not function correctly** for data persistence or uploads.

**Recommended Next Step:**
Switch to a cloud database (e.g., Neon/Postgres) and a cloud storage solution (e.g., Firebase Storage) before launching.
