"use client";

import React from "react";
import { clsx } from "clsx";

interface EmptyStateProps {
    type: "dinners" | "tasks" | "shopping";
    title: string;
    description: string;
    className?: string;
}

// SVG Illustrations for each type
const DinnersIllustration = () => (
    <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Plate */}
        <ellipse cx="60" cy="70" rx="45" ry="12" className="fill-orange-100" />
        <ellipse cx="60" cy="68" rx="40" ry="10" className="fill-white stroke-orange-200" strokeWidth="2" />
        {/* Cloche/Dome */}
        <path d="M25 68 Q25 30 60 25 Q95 30 95 68" className="fill-orange-100 stroke-orange-300" strokeWidth="2" />
        {/* Handle */}
        <ellipse cx="60" cy="22" rx="8" ry="4" className="fill-orange-200 stroke-orange-300" strokeWidth="2" />
        {/* Steam */}
        <path d="M45 15 Q43 10 45 5" className="stroke-orange-300" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M60 12 Q58 7 60 2" className="stroke-orange-300" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M75 15 Q73 10 75 5" className="stroke-orange-300" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Sparkles */}
        <circle cx="20" cy="50" r="2" className="fill-orange-300" />
        <circle cx="100" cy="45" r="2" className="fill-orange-300" />
        <circle cx="15" cy="75" r="1.5" className="fill-orange-200" />
        <circle cx="105" cy="72" r="1.5" className="fill-orange-200" />
    </svg>
);

const TasksIllustration = () => (
    <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Clipboard */}
        <rect x="25" y="20" width="70" height="85" rx="8" className="fill-violet-100 stroke-violet-300" strokeWidth="2" />
        <rect x="40" y="12" width="40" height="16" rx="4" className="fill-violet-200 stroke-violet-300" strokeWidth="2" />
        {/* Lines */}
        <rect x="35" y="40" width="50" height="6" rx="3" className="fill-violet-200" />
        <rect x="35" y="55" width="40" height="6" rx="3" className="fill-violet-200" />
        <rect x="35" y="70" width="45" height="6" rx="3" className="fill-violet-200" />
        <rect x="35" y="85" width="35" height="6" rx="3" className="fill-violet-200" />
        {/* Checkmarks */}
        <circle cx="35" cy="43" r="8" className="fill-violet-300" />
        <path d="M31 43 L34 46 L39 40" className="stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Sparkles */}
        <circle cx="100" cy="30" r="3" className="fill-violet-300" />
        <circle cx="15" cy="60" r="2" className="fill-violet-200" />
        <circle cx="108" cy="80" r="2" className="fill-violet-200" />
    </svg>
);

const ShoppingIllustration = () => (
    <svg viewBox="0 0 120 120" className="w-24 h-24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shopping bag */}
        <path d="M25 45 L30 100 Q30 105 35 105 L85 105 Q90 105 90 100 L95 45 Z" className="fill-emerald-100 stroke-emerald-300" strokeWidth="2" />
        {/* Bag opening */}
        <path d="M25 45 Q60 35 95 45" className="stroke-emerald-300" strokeWidth="2" fill="none" />
        {/* Handles */}
        <path d="M40 45 Q40 25 60 25 Q80 25 80 45" className="stroke-emerald-400" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Items peeking out */}
        <ellipse cx="50" cy="50" rx="8" ry="10" className="fill-orange-200" />
        <ellipse cx="70" cy="48" rx="6" ry="8" className="fill-green-200" />
        <rect x="55" y="42" width="10" height="15" rx="2" className="fill-yellow-200" />
        {/* Sparkles */}
        <circle cx="15" cy="55" r="3" className="fill-emerald-300" />
        <circle cx="105" cy="50" r="2" className="fill-emerald-200" />
        <circle cx="20" cy="90" r="2" className="fill-emerald-200" />
        <circle cx="100" cy="85" r="2.5" className="fill-emerald-300" />
    </svg>
);

export function EmptyState({ type, title, description, className }: EmptyStateProps) {
    const illustrations = {
        dinners: <DinnersIllustration />,
        tasks: <TasksIllustration />,
        shopping: <ShoppingIllustration />,
    };

    const colors = {
        dinners: "from-orange-50 to-amber-50 border-orange-100",
        tasks: "from-violet-50 to-purple-50 border-violet-100",
        shopping: "from-emerald-50 to-teal-50 border-emerald-100",
    };

    const textColors = {
        dinners: "text-orange-600",
        tasks: "text-violet-600",
        shopping: "text-emerald-600",
    };

    return (
        <div
            className={clsx(
                "flex flex-col items-center justify-center py-12 px-6 rounded-3xl border-2 border-dashed",
                "bg-gradient-to-br",
                colors[type],
                "animate-fade-in",
                className
            )}
        >
            <div className="mb-4 animate-bounce-slow">
                {illustrations[type]}
            </div>
            <h3 className={clsx("text-lg font-bold mb-2", textColors[type])}>
                {title}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-xs">
                {description}
            </p>
        </div>
    );
}
