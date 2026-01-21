"use client";

import { clsx } from "clsx";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
    return (
        <div
            className={clsx(
                "animate-spin rounded-full border-gray-300 border-t-gray-900",
                sizeClasses[size],
                className
            )}
            role="status"
            aria-label="Carregando..."
        >
            <span className="sr-only">Carregando...</span>
        </div>
    );
}

export function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 text-sm font-medium">A carregar...</p>
            </div>
        </div>
    );
}
