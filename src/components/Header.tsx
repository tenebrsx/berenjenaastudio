"use client";

import Link from "next/link";
import { useCursor } from "@/context/CursorContext";

// ... imports
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    categories?: { label: string; href: string }[];
}

export default function Header({ categories = [] }: HeaderProps) {
    const { setCursor } = useCursor();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMouseEnter = () => setCursor("link");
    const handleMouseLeave = () => setCursor("default");

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuVariants = {
        initial: { y: "-100%" },
        animate: { y: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } },
        exit: { y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } }
    }

    // Combine dynamic categories with static links
    const staticLinks = [
        { href: "/gallery", label: "GALERÍA" },
        { href: "/search", label: "BUSCAR" },
        { href: "/index", label: "ÍNDICE" },
    ];

    const navLinks = [...categories, ...staticLinks];

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 px-4 md:px-10 py-6 flex justify-between items-start mix-blend-difference text-white">
                {/* Desktop Navigation - Dynamic Categories */}
                <nav className="hidden md:flex flex-col gap-1 font-mono text-sm">
                    {categories.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="uppercase hover:text-accent transition-colors"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Trigger */}
                <button
                    className="md:hidden uppercase font-mono text-xs z-50 relative"
                    onClick={toggleMenu}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {isMenuOpen ? "CERRAR" : "MENÚ"}
                </button>

                {/* Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 text-center z-50">
                    <Link
                        href="/"
                        className="font-sans font-bold text-2xl md:text-3xl tracking-tighter uppercase"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        berejenastudio
                    </Link>
                </div>

                {/* Desktop Search / Extras */}
                <div className="hidden md:flex flex-col gap-1 font-mono text-sm text-right">
                    {staticLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="uppercase hover:text-accent transition-colors"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 bg-black z-40 flex flex-col justify-center items-center text-white"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="font-sans font-bold text-4xl uppercase hover:text-accent transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
