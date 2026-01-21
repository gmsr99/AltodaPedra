"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Dinner, User } from "@/types";
import { clsx } from "clsx";
import { useApp } from "@/context/AppContext";
import { UtensilsCrossed } from "lucide-react";
import { getTodayName } from "@/constants/days";
import { getPastelFromColor } from "@/constants/colors";

interface DinnerCardProps {
    dinner: Dinner;
    assignedUser?: User;
    index?: number;
}

export const DinnerCard = React.memo(function DinnerCard({
    dinner,
    assignedUser,
    index = 0,
}: DinnerCardProps) {
    const { data, updateDinners } = useApp();
    const [localDish, setLocalDish] = useState(dinner.dish);
    const isToday = dinner.day === getTodayName();

    // Get pastel color from assigned user
    const pastel = assignedUser
        ? getPastelFromColor(assignedUser.color)
        : { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-400" };

    const { setNodeRef, isOver } = useDroppable({
        id: `day-${dinner.day}`,
        data: { type: "day", day: dinner.day },
        disabled: data.config.isLocked,
    });

    useEffect(() => {
        setLocalDish(dinner.dish);
    }, [dinner.dish]);

    const handleBlur = useCallback(() => {
        if (localDish !== dinner.dish) {
            const newDinners = data.dinners.map((d) =>
                d.day === dinner.day ? { ...d, dish: localDish } : d
            );
            updateDinners(newDinners);
        }
    }, [localDish, dinner.dish, dinner.day, data.dinners, updateDinners]);

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 border-2",
                "animate-slide-up",
                isOver
                    ? "ring-2 ring-orange-400 scale-[1.02]"
                    : "",
                isToday
                    ? "bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200 shadow-md shadow-amber-100/50"
                    : clsx(pastel.bg, pastel.border)
            )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Day */}
            <div className="w-20 shrink-0">
                {isToday && (
                    <span className="text-xs font-medium uppercase tracking-wide text-amber-600">
                        Hoje
                    </span>
                )}
                <h3 className={clsx(
                    "font-bold",
                    isToday ? "text-amber-700" : "text-slate-700"
                )}>
                    {dinner.day.substring(0, 3)}
                </h3>
            </div>

            {/* User Avatar */}
            <div className="shrink-0">
                {assignedUser ? (
                    <div
                        className={clsx(
                            assignedUser.color,
                            "w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md",
                            isToday && "ring-2 ring-amber-300"
                        )}
                    >
                        {assignedUser.name.substring(0, 2).toUpperCase()}
                    </div>
                ) : (
                    <div
                        className={clsx(
                            "w-10 h-10 rounded-xl border-2 border-dashed flex items-center justify-center",
                            isToday
                                ? "border-amber-300 text-amber-400"
                                : "border-slate-200 text-slate-300"
                        )}
                    >
                        <UtensilsCrossed size={16} />
                    </div>
                )}
            </div>

            {/* User Name */}
            <div className="flex-1 min-w-0">
                <span className={clsx(
                    "text-sm font-medium truncate block",
                    isToday ? "text-amber-700" : "text-slate-600"
                )}>
                    {assignedUser?.name || "Sem atribuição"}
                </span>
            </div>

            {/* Dish Input */}
            <input
                type="text"
                value={localDish}
                onChange={(e) => setLocalDish(e.target.value)}
                onBlur={handleBlur}
                placeholder="Ementa..."
                disabled={data.config.isLocked}
                className={clsx(
                    "w-32 text-sm font-medium bg-transparent border-0 outline-none py-2 px-3 rounded-xl transition-colors text-right",
                    isToday
                        ? "placeholder:text-amber-400 text-amber-700 bg-white/50 focus:bg-white"
                        : "placeholder:text-slate-300 text-slate-600 bg-white/50 focus:bg-white"
                )}
            />
        </div>
    );
});
