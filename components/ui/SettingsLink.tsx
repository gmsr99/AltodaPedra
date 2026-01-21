"use client";

import { useApp } from "@/context/AppContext";
import { Settings } from "lucide-react";
import Link from "next/link";

export function SettingsLink() {
    const { data } = useApp();

    if (data.config.isLocked) return null;

    return (
        <Link
            href="/settings"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Abrir definições"
        >
            <Settings size={18} className="text-slate-600" />
        </Link>
    );
}
