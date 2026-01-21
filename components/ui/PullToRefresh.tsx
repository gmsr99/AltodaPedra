"use client";

import React, { useState, useRef, useCallback, ReactNode } from "react";
import { clsx } from "clsx";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
    children: ReactNode;
    onRefresh: () => Promise<void>;
    className?: string;
}

const PULL_THRESHOLD = 80;
const MAX_PULL = 120;

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const startY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isValidPull = useRef(false);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Don't start pull-to-refresh if touch started on a draggable element
        const target = e.target as HTMLElement;
        const isDraggable = target.closest('[data-rfd-draggable-id]') ||
            target.closest('[data-dnd-kit-draggable]') ||
            target.classList.contains('touch-none') ||
            target.closest('.touch-none');

        if (isDraggable) {
            isValidPull.current = false;
            return;
        }

        if (containerRef.current?.scrollTop === 0) {
            startY.current = e.touches[0].clientY;
            isValidPull.current = true;
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isValidPull.current || startY.current === 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        if (diff > 0 && containerRef.current?.scrollTop === 0) {
            // Apply resistance curve
            const resistance = 1 - Math.min(diff / (MAX_PULL * 2), 0.5);
            const distance = Math.min(diff * resistance, MAX_PULL);
            setPullDistance(distance);

            if (diff > 10) {
                e.preventDefault();
            }
        }
    }, [isRefreshing]);

    const handleTouchEnd = useCallback(async () => {
        if (!isValidPull.current) {
            isValidPull.current = false;
            return;
        }

        if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
            setIsRefreshing(true);
            setPullDistance(PULL_THRESHOLD);

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
        startY.current = 0;
        isValidPull.current = false;
    }, [pullDistance, isRefreshing, onRefresh]);

    const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);
    const shouldTrigger = pullDistance >= PULL_THRESHOLD;

    return (
        <div className={clsx("relative", className)}>
            {/* Pull indicator */}
            <div
                className="absolute left-0 right-0 flex items-center justify-center z-50 pointer-events-none overflow-hidden"
                style={{
                    height: pullDistance,
                    top: 0,
                    opacity: progress,
                }}
            >
                <div
                    className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                        shouldTrigger || isRefreshing
                            ? "bg-emerald-500 text-white shadow-lg"
                            : "bg-white text-slate-400 shadow-md border border-slate-100"
                    )}
                    style={{
                        transform: `scale(${0.5 + progress * 0.5}) rotate(${progress * 180}deg)`,
                    }}
                >
                    <RefreshCw
                        size={20}
                        className={clsx(isRefreshing && "animate-spin")}
                    />
                </div>
            </div>

            {/* Content container */}
            <div
                ref={containerRef}
                className="h-full overflow-y-auto"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: pullDistance === 0 ? "transform 0.3s ease-out" : "none",
                }}
            >
                {children}
            </div>
        </div>
    );
}
