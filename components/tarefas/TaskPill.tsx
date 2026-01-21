"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, User } from "@/types";
import { clsx } from "clsx";
import { useApp } from "@/context/AppContext";
import { Trash2, GripVertical } from "lucide-react";
import { getPastelFromColor } from "@/constants/colors";

interface TaskPillProps {
    task: Task;
    isLocked: boolean;
    user?: User;
    index?: number;
}

export const TaskPill = React.memo(function TaskPill({
    task,
    isLocked,
    user,
    index = 0
}: TaskPillProps) {
    const { removeTask } = useApp();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `task-${task.id}`,
        data: { type: "task", task },
        disabled: isLocked,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        animationDelay: `${index * 50}ms`,
    };

    // Get pastel version of user's color
    const pastel = getPastelFromColor(user?.color || "bg-slate-500");

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Apagar esta tarefa?")) {
            removeTask(task.id);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "p-3 rounded-xl mb-2 flex items-center gap-3 border-2 transition-all duration-200",
                pastel.bg,
                pastel.border,
                "animate-scale-in",
                isDragging && "opacity-70 scale-105 shadow-lg z-50 rotate-1",
                !isDragging && "hover:shadow-md hover:scale-[1.01]"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                style={{ touchAction: "none" }}
                className={clsx(
                    "p-1 rounded-lg transition-colors",
                    isLocked ? "cursor-not-allowed opacity-30" : "cursor-grab active:cursor-grabbing hover:bg-white/50",
                    pastel.text
                )}
            >
                <GripVertical size={16} />
            </div>

            {/* User Avatar */}
            {user && (
                <div
                    className={clsx(
                        user.color,
                        "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                    )}
                >
                    {user.name.substring(0, 2).toUpperCase()}
                </div>
            )}

            {/* Task Label */}
            <span className="flex-1 font-medium text-gray-700 text-sm">
                {task.label}
            </span>

            {/* Delete Button */}
            {!isLocked && (
                <button
                    type="button"
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-white/50 rounded-lg transition-all"
                    onClick={handleDelete}
                    aria-label={`Apagar tarefa ${task.label}`}
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
});
