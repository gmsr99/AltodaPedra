"use client";

import React, { ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import { PullToRefresh } from "./PullToRefresh";

interface MainContentProps {
    children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
    const { refetchData } = useApp();

    return (
        <PullToRefresh
            onRefresh={refetchData}
            className="pt-20 pb-24 min-h-screen"
        >
            <main className="px-4 max-w-lg mx-auto">
                {children}
            </main>
        </PullToRefresh>
    );
}
