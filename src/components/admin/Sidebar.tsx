"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    LogOut,
    Menu,
    X,
    User
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: "Panel de Control", href: "/admin", icon: LayoutDashboard },
    { name: "Proyectos", href: "/admin/projects", icon: FolderKanban },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fixed top-4 left-4 z-50 md:hidden bg-black p-2 rounded-lg shadow-lg border border-zinc-700"
            >
                {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <Menu className="h-6 w-6 text-white" />
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-spring",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Brand */}
                    <div className="flex items-center h-16 px-6 border-b border-zinc-800">
                        <h1 className="text-lg font-semibold text-white">Berejena Studio</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-[#FF8562] text-white"
                                            : "text-zinc-300 hover:bg-zinc-900"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    {user && (
                        <div className="px-3 py-3 border-t border-zinc-800">
                            <div className="flex items-center gap-3 px-3 py-2">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        className="h-8 w-8 rounded-full"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <User className="h-4 w-4 text-zinc-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user.displayName || "Admin"}
                                    </p>
                                    <p className="text-xs text-zinc-400 truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout */}
                    <div className="p-3 border-t border-zinc-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-zinc-900 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
