"use client";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { DinnerCard } from "./DinnerCard";
import { DraggableUser } from "./DraggableUser";
import { User } from "@/types";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function DinnerView() {
    const { data, updateDinners } = useApp();
    const [activeUser, setActiveUser] = useState<User | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 100, tolerance: 5 },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "user") {
            setActiveUser(event.active.data.current.user as User);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveUser(null);

        if (!over) return;

        if (
            active.data.current?.type === "user" &&
            over.data.current?.type === "day"
        ) {
            const user = active.data.current.user as User;
            const day = over.data.current.day as string;

            const newDinners = data.dinners.map((d) =>
                d.day === day ? { ...d, userId: user.id } : d
            );
            updateDinners(newDinners);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col gap-4 animate-fade-in">
                {/* User Picker - Compact with full names */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Arraste para atribuir
                        </span>
                    </div>

                    {/* Horizontal scroll with full names */}
                    <div className="flex flex-wrap gap-2">
                        {data.users.map((user) => (
                            <DraggableUser
                                key={user.id}
                                user={user}
                                isLocked={data.config.isLocked}
                                showName
                            />
                        ))}
                        {data.users.length === 0 && (
                            <p className="text-sm text-slate-400 py-2">
                                Desbloqueie e adicione pessoas nas definições
                            </p>
                        )}
                    </div>
                </div>

                {/* Week Grid - Clean vertical list */}
                {data.users.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {data.dinners.map((dinner, index) => {
                            const assignedUser = data.users.find((u) => u.id === dinner.userId);
                            return (
                                <DinnerCard
                                    key={dinner.day}
                                    dinner={dinner}
                                    assignedUser={assignedUser}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        type="dinners"
                        title="Sem agregado familiar"
                        description="Adicione pessoas nas definições para começar a organizar os jantares da semana."
                    />
                )}
            </div>

            <DragOverlay modifiers={[snapCenterToCursor]}>
                {activeUser ? (
                    <DraggableUser user={activeUser} isLocked={false} isDragging showName />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
