"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import { cn } from "@/lib/utils";

export default function Cursor() {
    const { cursorType, cursorText } = useCursor();
    const [isVisible, setIsVisible] = useState(false);

    // Mouse position state
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth springs for lag effect
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Only show custom cursor on non-touch devices
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => {
            // Optional: Add click scale effect logic here if needed
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    // Variants for different cursor states
    const variants = {
        default: {
            height: 16,
            width: 16,
            backgroundColor: "#FF8562", // Accent color
            border: "0px solid transparent",
        },
        link: {
            height: 64,
            width: 64,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        text: {
            height: 100,
            width: 100,
            backgroundColor: "#FF8562",
            border: "0px solid transparent",
        },
        video: {
            height: 80,
            width: 80,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "0px solid transparent",
        },
        hidden: {
            height: 0,
            width: 0,
            opacity: 0,
        }
    };

    return (
        <motion.div
            className={cn(
                "fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center mix-blend-difference"
            )}
            style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
            }}
            animate={cursorType}
            variants={variants}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
            {/* Text Label (VIEW, PLAY, etc) */}
            <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: cursorType === "text" || cursorType === "video" ? 1 : 0,
                    scale: cursorType === "text" || cursorType === "video" ? 1 : 0
                }}
                className={cn(
                    "font-mono text-xs font-bold uppercase tracking-widest text-black",
                    cursorType === "video" && "text-black"
                )}
            >
                {cursorText}
            </motion.span>
        </motion.div>
    );
}
