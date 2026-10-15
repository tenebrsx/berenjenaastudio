import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getBuildProjects } from "@/lib/media";

type Doc = { id: string; data: () => Record<string, unknown> };

/**
 * Snapshot-like list of projects. Uses Firestore when reachable; if it is blocked/offline
 * (getDocs then resolves with an empty cache snapshot or throws), falls back to the list
 * baked in at build time so pages never render empty.
 */
export async function getProjectsSnapshot(): Promise<{ docs: Doc[] }> {
    const fromBuild = () => ({
        docs: getBuildProjects<Record<string, unknown> & { id: string }>().map(({ id, ...rest }) => ({ id, data: () => rest })),
    });
    try {
        const snap = await getDocs(collection(db, "projects"));
        if (snap.metadata.fromCache || snap.empty) return fromBuild();
        return snap;
    } catch {
        return fromBuild();
    }
}
