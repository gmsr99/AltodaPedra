"use client";

import React, { useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ShoppingItem, User } from "@/types";
import { clsx } from "clsx";
import { Check, Trash2, ShoppingBag } from "lucide-react";

// Pastel color palette
const PASTEL_COLORS = [
    { bg: "bg-rose-100", border: "border-rose-200", text: "text-rose-400" },
    { bg: "bg-orange-100", border: "border-orange-200", text: "text-orange-400" },
    { bg: "bg-amber-100", border: "border-amber-200", text: "text-amber-400" },
    { bg: "bg-yellow-100", border: "border-yellow-200", text: "text-yellow-400" },
    { bg: "bg-lime-100", border: "border-lime-200", text: "text-lime-400" },
    { bg: "bg-green-100", border: "border-green-200", text: "text-green-400" },
    { bg: "bg-emerald-100", border: "border-emerald-200", text: "text-emerald-400" },
    { bg: "bg-teal-100", border: "border-teal-200", text: "text-teal-400" },
    { bg: "bg-cyan-100", border: "border-cyan-200", text: "text-cyan-400" },
    { bg: "bg-sky-100", border: "border-sky-200", text: "text-sky-400" },
    { bg: "bg-blue-100", border: "border-blue-200", text: "text-blue-400" },
    { bg: "bg-indigo-100", border: "border-indigo-200", text: "text-indigo-400" },
    { bg: "bg-violet-100", border: "border-violet-200", text: "text-violet-400" },
    { bg: "bg-purple-100", border: "border-purple-200", text: "text-purple-400" },
    { bg: "bg-fuchsia-100", border: "border-fuchsia-200", text: "text-fuchsia-400" },
    { bg: "bg-pink-100", border: "border-pink-200", text: "text-pink-400" },
];

// Generate consistent color based on item ID
function getColorFromId(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PASTEL_COLORS.length;
    return PASTEL_COLORS[index];
}

interface ShoppingItemComponentProps {
    item: ShoppingItem;
    assignedUser?: User;
    isLocked: boolean;
    onDelete?: () => void;
}

export const ShoppingItemComponent = React.memo(function ShoppingItemComponent({
    item,
    assignedUser,
    isLocked,
    onDelete,
}: ShoppingItemComponentProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `shop-${item.id}`,
        data: { type: "shopping-item", item },
        disabled: isLocked || item.done,
    });

    const x = transform?.x || 0;

    const style = {
        transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
    };

    // Get consistent pastel color for this item
    const color = useMemo(() => getColorFromId(item.id), [item.id]);

    const handleDelete = (e: React.PointerEvent | React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete?.();
    };

    return (
        <div className="relative mb-3 group" role="listitem">
            {/* Background Actions - Swipe to complete with dynamic feedback */}
            <div
                className="absolute inset-0 rounded-2xl flex items-center justify-start px-4 text-white font-bold overflow-hidden"
                style={{
                    opacity: Math.min(x / 50, 1),
                    background: `linear-gradient(90deg, rgb(34, 197, 94) 0%, rgb(74, 222, 128) 100%)`
                }}
                aria-hidden="true"
            >
                <div
                    className="flex items-center gap-2 transition-transform"
                    style={{
                        transform: `scale(${Math.min(0.8 + (x / 150), 1.2)}) translateX(${Math.min(x * 0.3, 20)}px)`,
                        opacity: x > 20 ? 1 : 0
                    }}
                >
                    <Check size={24} strokeWidth={3} />
                    <span className="text-sm font-semibold">Comprado!</span>
                </div>
            </div>

            {/* Foreground Card */}
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={clsx(
                    "relative p-4 rounded-2xl flex items-center justify-between touch-pan-y transition-all duration-200",
                    color.bg,
                    color.border,
                    "border-2",
                    item.done && "opacity-40",
                    !isLocked && !item.done && "cursor-grab active:cursor-grabbing",
                    isDragging && "shadow-lg z-10 scale-[1.02]",
                    !isDragging && "hover:shadow-md hover:scale-[1.01]"
                )}
                aria-label={`${item.item}${item.done ? " - comprado" : ""}`}
            >
                <div className="flex items-center gap-3 flex-1">
                    {/* Color Circle */}
                    {assignedUser ? (
                        <div
                            className={clsx(
                                assignedUser.color,
                                "w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                            )}
                            aria-label={`Atribuído a ${assignedUser.name}`}
                        >
                            {assignedUser.name.substring(0, 2).toUpperCase()}
                        </div>
                    ) : (
                        <div
                            className={clsx(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                color.border,
                                "border-2 bg-white/50"
                            )}
                        >
                            <ShoppingBag size={16} className={color.text} />
                        </div>
                    )}

                    <span
                        className={clsx(
                            "font-medium",
                            item.done ? "text-gray-400 line-through" : "text-gray-700"
                        )}
                    >
                        {item.item}
                    </span>
                </div>

                {/* Day badge and delete button */}
                <div className="flex items-center gap-2">
                    {item.day && (
                        <span className={clsx(
                            "text-xs font-medium px-2 py-1 rounded-lg",
                            color.border,
                            "border bg-white/50",
                            color.text
                        )}>
                            {item.day.substring(0, 3)}
                        </span>
                    )}

                    {!isLocked && (
                        <button
                            type="button"
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors pointer-events-auto z-10 hover:bg-white/50 rounded-lg"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={handleDelete}
                            aria-label={`Remover ${item.item}`}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
});
