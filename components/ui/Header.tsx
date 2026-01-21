"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { LockSwitch } from "./LockSwitch";
import { SettingsLink } from "./SettingsLink";

const PAGE_TITLES: Record<string, string> = {
    "/jantares": "Jantares",
    "/tarefas": "Tarefas",
    "/compras": "Compras",
    "/settings": "Definições",
};

export function Header() {
    const pathname = usePathname();
    const title = PAGE_TITLES[pathname] || "Jantares";

    return (
        <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/20">
            <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/Logo.png"
                        alt="Alto da Pedra"
                        width={48}
                        height={48}
                        className="rounded-xl object-contain"
                    />
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">
                            {title}
                        </h1>
                        <p className="text-xs text-slate-400 font-medium">Alto da Pedra</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <SettingsLink />
                    <LockSwitch />
                </div>
            </div>
        </header>
    );
}
