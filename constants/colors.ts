/**
 * Color constants for the HOMEFLOW application
 */

// User avatar colors (Tailwind classes)
export const USER_COLORS = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
] as const;

// Task color keys (stored in database)
export const TASK_COLOR_KEYS = ["green", "blue", "orange", "red", "purple", "yellow"] as const;

// Task color mapping (key -> Tailwind class)
export const TASK_COLOR_MAP: Record<string, string> = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
};

// Get task color class from key, with fallback
export function getTaskColorClass(colorKey: string): string {
    return TASK_COLOR_MAP[colorKey] || "bg-gray-500";
}

// Pastel color mapping (from solid color to pastel version)
export interface PastelColor {
    bg: string;
    border: string;
    text: string;
}

const PASTEL_MAP: Record<string, PastelColor> = {
    "bg-red-500": { bg: "bg-red-50", border: "border-red-200", text: "text-red-400" },
    "bg-orange-500": { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-400" },
    "bg-amber-500": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-400" },
    "bg-yellow-500": { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-400" },
    "bg-lime-500": { bg: "bg-lime-50", border: "border-lime-200", text: "text-lime-400" },
    "bg-green-500": { bg: "bg-green-50", border: "border-green-200", text: "text-green-400" },
    "bg-emerald-500": { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-400" },
    "bg-teal-500": { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-400" },
    "bg-cyan-500": { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-400" },
    "bg-sky-500": { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-400" },
    "bg-blue-500": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-400" },
    "bg-indigo-500": { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-400" },
    "bg-violet-500": { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-400" },
    "bg-purple-500": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-400" },
    "bg-fuchsia-500": { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-400" },
    "bg-pink-500": { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-400" },
    "bg-rose-500": { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-400" },
};

const DEFAULT_PASTEL: PastelColor = { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-400" };

// Get pastel version of a user color
export function getPastelFromColor(solidColor: string): PastelColor {
    return PASTEL_MAP[solidColor] || DEFAULT_PASTEL;
}

export type UserColor = typeof USER_COLORS[number];
export type TaskColorKey = typeof TASK_COLOR_KEYS[number];

