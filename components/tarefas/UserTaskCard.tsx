"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { User, Task } from "@/types";
import { TaskPill } from "./TaskPill";
import { clsx } from "clsx";
import { useApp } from "@/context/AppContext";
import { Plus } from "lucide-react";

interface UserTaskCardProps {
    user: User;
    tasks: Task[];
    index?: number;
}

export function UserTaskCard({ user, tasks, index = 0 }: UserTaskCardProps) {
    const { data } = useApp();
    const { setNodeRef, isOver } = useDroppable({
        id: `user-col-${user.id}`,
        data: { type: "user-col", userId: user.id },
    });

    return (
        <div
            ref={setNodeRef}
            className={clsx(
                "rounded-2xl p-4 transition-all duration-300 animate-slide-up",
                isOver
                    ? "bg-violet-100 ring-2 ring-violet-400"
                    : "bg-white border border-slate-100 shadow-sm"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* User Header */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className={clsx(
                        user.color,
                        "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                    )}
                >
                    {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{user.name}</h3>
                    <p className="text-xs text-slate-400">
                        {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
                    </p>
                </div>
                <div className="px-2 py-1 bg-violet-50 rounded-lg">
                    <span className="text-xs font-bold text-violet-500">{tasks.length}</span>
                </div>
            </div>

            {/* Tasks List */}
            <SortableContext
                items={tasks.map((t) => `task-${t.id}`)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col min-h-[40px]">
                    {tasks.length === 0 && (
                        <div className="py-4 text-center">
                            <p className="text-sm text-slate-300">Sem tarefas</p>
                        </div>
                    )}
                    {tasks.map((task, taskIndex) => (
                        <TaskPill
                            key={task.id}
                            task={task}
                            user={user}
                            isLocked={data.config.isLocked}
                            index={taskIndex}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Add Task Input */}
            {!data.config.isLocked && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                    <InlineTaskInput userId={user.id} />
                </div>
            )}
        </div>
    );
}

function InlineTaskInput({ userId }: { userId: string }) {
    const { addTask } = useApp();
    const [label, setLabel] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!label.trim()) return;
        addTask(label, userId, "blue");
        setLabel("");
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                className={clsx(
                    "w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm outline-none transition-all",
                    "placeholder:text-slate-300 text-slate-700",
                    isFocused
                        ? "bg-white ring-2 ring-violet-200"
                        : "hover:bg-slate-100"
                )}
                placeholder={isFocused ? "Nome da tarefa..." : "+ Adicionar tarefa"}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {label.trim() && (
                <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-violet-500 hover:bg-violet-600 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                    <Plus size={16} />
                </button>
            )}
        </form>
    );
}
