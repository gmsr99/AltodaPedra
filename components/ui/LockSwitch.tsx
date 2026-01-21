"use client";

import * as Switch from "@radix-ui/react-switch";
import { Lock, Unlock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { clsx } from "clsx";

export function LockSwitch() {
    const { data, setLocked } = useApp();
    const isLocked = data.config.isLocked;

    return (
        <div className="flex items-center gap-2">
            <Switch.Root
                className={clsx(
                    "w-12 h-7 rounded-full relative transition-all duration-300 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
                    isLocked
                        ? "bg-slate-200"
                        : "bg-gradient-to-r from-indigo-500 to-violet-500"
                )}
                id="lock-mode"
                checked={isLocked}
                onCheckedChange={setLocked}
                aria-label={isLocked ? "Desbloquear edição" : "Bloquear edição"}
            >
                <Switch.Thumb
                    className={clsx(
                        "block w-5 h-5 rounded-full shadow-md transition-all duration-300",
                        "translate-x-1 data-[state=checked]:translate-x-6",
                        isLocked ? "bg-white" : "bg-white"
                    )}
                >
                    <span className="flex items-center justify-center h-full">
                        {isLocked ? (
                            <Lock size={12} className="text-slate-400" />
                        ) : (
                            <Unlock size={12} className="text-indigo-500" />
                        )}
                    </span>
                </Switch.Thumb>
            </Switch.Root>
        </div>
    );
}
