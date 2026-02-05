"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CursorType = "default" | "link" | "text" | "video" | "hidden";

interface CursorContextType {
    cursorType: CursorType;
    cursorText: string | null;
    setCursor: (type: CursorType, text?: string | null) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
    const [cursorType, setCursorType] = useState<CursorType>("default");
    const [cursorText, setCursorText] = useState<string | null>(null);

    const setCursor = (type: CursorType, text: string | null = null) => {
        setCursorType(type);
        setCursorText(text);
    };

    return (
        <CursorContext.Provider value={{ cursorType, cursorText, setCursor }}>
            {children}
        </CursorContext.Provider>
    );
}

export function useCursor() {
    const context = useContext(CursorContext);
    if (context === undefined) {
        throw new Error("useCursor must be used within a CursorProvider");
    }
    return context;
}
