"use client";

import { useDraggable } from "@dnd-kit/core";
import { User } from "@/types";
import { clsx } from "clsx";

interface DraggableUserProps {
    user: User;
    isLocked: boolean;
    isDragging?: boolean;
    showName?: boolean;
}

export function DraggableUser({
    user,
    isLocked,
    isDragging: isDraggingProp,
    showName = false,
}: DraggableUserProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: `user-${user.id}`,
            data: { type: "user", user },
            disabled: isLocked,
        });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    const isCurrentlyDragging = isDragging || isDraggingProp;

    if (showName) {
        // Compact pill with name
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-xl touch-none transition-all duration-200 shrink-0",
                    user.color,
                    "text-white shadow-md",
                    isCurrentlyDragging && "shadow-xl scale-110 z-50 opacity-90 rotate-2",
                    isLocked && "opacity-60 cursor-not-allowed",
                    !isLocked && !isCurrentlyDragging && "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg"
                )}
            >
                <span className="text-xs font-bold">
                    {user.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-medium whitespace-nowrap">
                    {user.name}
                </span>
            </div>
        );
    }

    // Original circle style
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={clsx(
                user.color,
                "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md touch-none transition-all duration-200",
                isCurrentlyDragging && "shadow-xl scale-110 z-50 opacity-90 rotate-3",
                isLocked && "opacity-60 cursor-not-allowed",
                !isLocked && !isCurrentlyDragging && "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg"
            )}
        >
            {user.name.substring(0, 2).toUpperCase()}
        </div>
    );
}
