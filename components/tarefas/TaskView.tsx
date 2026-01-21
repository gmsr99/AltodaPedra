"use client";

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { UserTaskCard } from "./UserTaskCard";
import { TaskPill } from "./TaskPill";
import { Task } from "@/types";
import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.5",
            },
        },
    }),
};

export function TaskView() {
    const { data, updateTasks } = useApp();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 8 },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "task") {
            setActiveTask(event.active.data.current.task as Task);
        }
    };

    // Block body scroll while dragging
    useEffect(() => {
        if (activeTask) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [activeTask]);

    const handleDragOver = (event: DragOverEvent) => {
        // Visual feedback handled by dnd-kit
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const findContainer = (id: string) => {
            if (id.toString().startsWith("user-col-")) {
                return id.toString().replace("user-col-", "");
            }
            const task = data.tasks.find((t) => `task-${t.id}` === id);
            return task?.userId;
        };

        const activeContainer = findContainer(activeId as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer) return;

        if (activeContainer !== overContainer) {
            const task = data.tasks.find((t) => `task-${t.id}` === activeId);
            if (task) {
                const newTasks = data.tasks.map((t) =>
                    t.id === task.id ? { ...t, userId: overContainer } : t
                );
                updateTasks(newTasks);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col gap-4 animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">
                            Arraste para reorganizar
                        </p>
                    </div>
                </div>

                {/* User Cards */}
                <div className="flex flex-col gap-4">
                    {data.users.map((user, index) => {
                        const userTasks = data.tasks.filter((t) => t.userId === user.id);
                        return (
                            <UserTaskCard
                                key={user.id}
                                user={user}
                                tasks={userTasks}
                                index={index}
                            />
                        );
                    })}
                </div>

                {data.users.length === 0 && (
                    <EmptyState
                        type="tasks"
                        title="Sem tarefas configuradas"
                        description="Adicione pessoas e depois crie tarefas nas definições para começar a organizar."
                    />
                )}
            </div>

            <DragOverlay dropAnimation={dropAnimation} modifiers={[snapCenterToCursor]}>
                {activeTask ? <TaskPill task={activeTask} isLocked={false} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
