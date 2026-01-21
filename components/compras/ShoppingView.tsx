"use client";

import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { useApp } from "@/context/AppContext";
import { ShoppingItemComponent } from "./ShoppingItemComponent";
import { useState, useMemo, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EmptyState } from "@/components/ui/EmptyState";

const SWIPE_THRESHOLD = 50;

export function ShoppingView() {
    const { data, updateShopping, removeShoppingItem, addShoppingItem } = useApp();
    const [newItemText, setNewItemText] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Minimum distance before drag starts
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100, // Short delay before touch drag starts
                tolerance: 5,
            },
        })
    );

    // Memoize filtered items
    const { activeItems, doneItems } = useMemo(() => ({
        activeItems: data.shopping.filter((i) => !i.done),
        doneItems: data.shopping.filter((i) => i.done),
    }), [data.shopping]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, delta } = event;
        if (delta.x > SWIPE_THRESHOLD) {
            // Swiped Right -> Mark Done
            const itemId = active.id.toString().replace("shop-", "");
            const newShopping = data.shopping.map((item) =>
                item.id === itemId ? { ...item, done: true } : item
            );
            updateShopping(newShopping);
        }
    }, [data.shopping, updateShopping]);

    const handleAddItem = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedText = newItemText.trim();
        if (!trimmedText) return;

        await addShoppingItem(trimmedText, "general");
        setNewItemText("");
    }, [newItemText, addShoppingItem]);

    const handleClearDone = useCallback(async () => {
        if (!confirm(`Apagar ${doneItems.length} item(ns) comprado(s)?`)) return;

        try {
            const doneIds = doneItems.map((item) => item.id);
            const { error } = await supabase
                .from("shopping_items")
                .delete()
                .in("id", doneIds);

            if (error) throw error;

            // Update local state
            const newShopping = data.shopping.filter((item) => !item.done);
            updateShopping(newShopping);
        } catch (error) {
            console.error("Error deleting completed items:", error);
        }
    }, [doneItems, data.shopping, updateShopping]);

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis]}
        >
            <div className="flex flex-col h-full gap-4 pb-20">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Lista de Compras</h2>
                    {!data.config.isLocked && doneItems.length > 0 && (
                        <button
                            onClick={handleClearDone}
                            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                            aria-label={`Limpar ${doneItems.length} itens comprados`}
                        >
                            <Trash2 size={16} />
                            Limpar Comprados
                        </button>
                    )}
                </div>

                {/* Add Item */}
                <form onSubmit={handleAddItem} className="flex gap-2">
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Adicionar item..."
                        aria-label="Novo item de compras"
                        className="flex-1 px-4 py-3 rounded-2xl bg-gray-100 focus:bg-white border-transparent focus:border-gray-200 border-2 transition-colors outline-none text-black placeholder:text-gray-400"
                    />
                    <button
                        type="submit"
                        aria-label="Adicionar item"
                        className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold shadow-md active:scale-95 transition-transform hover:bg-gray-800"
                    >
                        <Plus />
                    </button>
                </form>

                <div className="flex flex-col gap-2 overflow-y-auto">
                    {activeItems.length === 0 && doneItems.length === 0 && (
                        <EmptyState
                            type="shopping"
                            title="Lista de compras vazia"
                            description="Adicione itens à sua lista usando o campo acima. Arraste para a direita para marcar como comprado."
                        />
                    )}

                    {activeItems.map((item) => {
                        // Find user if item is dinner
                        let assignedUser = undefined;
                        if (item.type === "dinner" && item.day) {
                            const dinner = data.dinners.find((d) => d.day === item.day);
                            if (dinner?.userId) {
                                assignedUser = data.users.find((u) => u.id === dinner.userId);
                            }
                        }

                        return (
                            <ShoppingItemComponent
                                key={item.id}
                                item={item}
                                isLocked={data.config.isLocked}
                                assignedUser={assignedUser}
                                onDelete={() => removeShoppingItem(item.id)}
                            />
                        );
                    })}

                    {doneItems.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                Comprados ({doneItems.length})
                            </h3>
                            {doneItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-gray-50 rounded-2xl mb-2 flex justify-between items-center group"
                                >
                                    <span className="text-gray-400 line-through decoration-2 flex-1">
                                        {item.item}
                                    </span>
                                    {!data.config.isLocked && (
                                        <button
                                            onClick={() => removeShoppingItem(item.id)}
                                            className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                            aria-label={`Remover ${item.item}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DndContext>
    );
}
