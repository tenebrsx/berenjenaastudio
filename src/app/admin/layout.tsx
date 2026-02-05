import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "Admin Panel | Berejena Studio",
    description: "Manage your portfolio",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Wrap admin pages with AuthProvider for authentication
    return <AuthProvider>{children}</AuthProvider>;
}
