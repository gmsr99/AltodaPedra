"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, ListCheck, ShoppingCart } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
    {
        href: "/jantares",
        label: "Jantares",
        icon: Coffee,
        color: "text-orange-500",
        bgColor: "bg-orange-500",
        lightBg: "bg-orange-50",
    },
    {
        href: "/tarefas",
        label: "Tarefas",
        icon: ListCheck,
        color: "text-violet-500",
        bgColor: "bg-violet-500",
        lightBg: "bg-violet-50",
    },
    {
        href: "/compras",
        label: "Compras",
        icon: ShoppingCart,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500",
        lightBg: "bg-emerald-50",
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            <div className="max-w-lg mx-auto px-4 pb-safe">
                <div className="glass rounded-2xl shadow-lg border border-white/20 mb-4 mx-2">
                    <div className="flex justify-around items-center py-2 px-2">
                        {NAV_ITEMS.map(({ href, label, icon: Icon, color, bgColor, lightBg }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={clsx(
                                        "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300 min-w-[72px]",
                                        isActive
                                            ? `${lightBg} ${color}`
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="relative">
                                        <Icon
                                            size={22}
                                            strokeWidth={isActive ? 2.5 : 2}
                                            className="transition-all duration-300"
                                        />
                                        {isActive && (
                                            <span
                                                className={clsx(
                                                    "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                                                    bgColor
                                                )}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={clsx(
                                            "text-[11px] font-semibold transition-all duration-300",
                                            isActive ? "opacity-100" : "opacity-70"
                                        )}
                                    >
                                        {label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
