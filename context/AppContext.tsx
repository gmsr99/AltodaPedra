"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AppData, User, Task, Dinner, ShoppingItem } from "@/types";
import { supabase } from "@/lib/supabase";
import { DAYS_OF_WEEK, getDayOrder } from "@/constants/days";
import { DbUser, DbTask, DbDinner, DbShoppingItem, DbAppConfig } from "@/types/database";
import { LoadingScreen } from "@/components/ui/LoadingSpinner";

const INITIAL_DATA: AppData = {
    config: { isLocked: true },
    users: [],
    tasks: [],
    dinners: [],
    shopping: [],
};

interface AppContextType {
    data: AppData;
    isLoading: boolean;
    refetchData: () => Promise<void>;
    setLocked: (locked: boolean) => void;
    updateDinners: (dinners: Dinner[]) => void;
    updateTasks: (tasks: Task[]) => void;
    updateShopping: (shopping: ShoppingItem[]) => void;
    resetShopping: () => void;
    addUser: (name: string, color: string) => void;
    removeUser: (userId: string) => void;
    addTask: (label: string, userId: string, color: string) => void;
    removeTask: (taskId: string) => void;
    removeShoppingItem: (itemId: string) => void;
    addShoppingItem: (item: string, type?: "general" | "dinner", day?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<AppData>(INITIAL_DATA);
    const [mounted, setMounted] = useState(false);

    // Fetch all data from Supabase
    const fetchData = useCallback(async () => {
        try {
            const [configRes, usersRes, tasksRes, dinnersRes, shoppingRes] = await Promise.all([
                supabase.from("app_config").select("*").single(),
                supabase.from("users").select("*"),
                supabase.from("tasks").select("*"),
                supabase.from("weekly_dinners").select("*"),
                supabase.from("shopping_items").select("*"),
            ]);

            // Map database types to app types
            const config = configRes.data as DbAppConfig | null;
            const users = (usersRes.data as DbUser[] | null) || [];
            const tasks = (tasksRes.data as DbTask[] | null) || [];
            const dinners = (dinnersRes.data as DbDinner[] | null) || [];
            const shopping = (shoppingRes.data as DbShoppingItem[] | null) || [];

            // Map tasks (snake_case to camelCase)
            const mappedTasks: Task[] = tasks.map((t) => ({
                id: t.id,
                label: t.label,
                userId: t.user_id || "",
                color: t.color,
            }));

            // Map dinners - ensure all days exist
            const mappedDinners: Dinner[] = DAYS_OF_WEEK.map((day, index) => {
                const existing = dinners.find((d) => d.day === day);
                return {
                    day,
                    userId: existing?.user_id || null,
                    dish: existing?.dish || "",
                    order: index + 1,
                };
            });

            // Map shopping items
            const mappedShopping: ShoppingItem[] = shopping.map((s) => ({
                id: s.id,
                item: s.item,
                type: s.type,
                day: s.day || undefined,
                done: s.done,
            }));

            setData({
                config: { isLocked: config?.is_locked ?? true },
                users,
                tasks: mappedTasks,
                dinners: mappedDinners,
                shopping: mappedShopping,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    // Initial Fetch & Subscription
    useEffect(() => {
        fetchData().then(() => setMounted(true));

        // Realtime Subscription
        const channel = supabase
            .channel("realtime-homeflow")
            .on("postgres_changes", { event: "*", schema: "public" }, () => {
                fetchData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchData]);

    const setLocked = useCallback(async (isLocked: boolean) => {
        const prevLocked = data.config.isLocked;
        setData((prev) => ({ ...prev, config: { isLocked } }));

        try {
            const { error } = await supabase.from("app_config").upsert({ id: 1, is_locked: isLocked });
            if (error) throw error;
        } catch (error) {
            console.error("Error updating lock state:", error);
            setData((prev) => ({ ...prev, config: { isLocked: prevLocked } }));
        }
    }, [data.config.isLocked]);

    const updateDinners = useCallback(async (dinners: Dinner[]) => {
        const prevDinners = data.dinners;
        setData((prev) => ({ ...prev, dinners }));

        try {
            const updates = dinners.map((d) => ({
                day: d.day,
                user_id: d.userId,
                dish: d.dish,
                order: getDayOrder(d.day),
            }));
            const { error } = await supabase.from("weekly_dinners").upsert(updates);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating dinners:", error);
            setData((prev) => ({ ...prev, dinners: prevDinners }));
        }
    }, [data.dinners]);

    const updateTasks = useCallback(async (tasks: Task[]) => {
        const prevTasks = data.tasks;
        setData((prev) => ({ ...prev, tasks }));

        try {
            const updates = tasks.map((t) => ({
                id: t.id,
                label: t.label,
                user_id: t.userId,
                color: t.color,
            }));
            const { error } = await supabase.from("tasks").upsert(updates);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating tasks:", error);
            setData((prev) => ({ ...prev, tasks: prevTasks }));
        }
    }, [data.tasks]);

    const updateShopping = useCallback(async (shopping: ShoppingItem[]) => {
        const prevShopping = data.shopping;
        setData((prev) => ({ ...prev, shopping }));

        try {
            const updates = shopping.map((s) => ({
                id: s.id,
                item: s.item,
                type: s.type,
                day: s.day || null,
                done: s.done,
            }));
            const { error } = await supabase.from("shopping_items").upsert(updates);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating shopping:", error);
            setData((prev) => ({ ...prev, shopping: prevShopping }));
        }
    }, [data.shopping]);

    const addShoppingItem = useCallback(async (
        item: string,
        type: "general" | "dinner" = "general",
        day?: string
    ) => {
        const tempId = `temp-${Date.now()}`;
        const newItem: ShoppingItem = {
            id: tempId,
            item,
            type,
            day,
            done: false,
        };

        setData((prev) => ({ ...prev, shopping: [...prev.shopping, newItem] }));

        try {
            const { data: inserted, error } = await supabase
                .from("shopping_items")
                .insert({ item, type, day: day || null, done: false })
                .select()
                .single();

            if (error) throw error;

            if (inserted) {
                setData((prev) => ({
                    ...prev,
                    shopping: prev.shopping.map((s) =>
                        s.id === tempId ? { ...s, id: inserted.id } : s
                    ),
                }));
            }
        } catch (error) {
            console.error("Error adding shopping item:", error);
            setData((prev) => ({
                ...prev,
                shopping: prev.shopping.filter((s) => s.id !== tempId),
            }));
        }
    }, []);

    const resetShopping = useCallback(async () => {
        const prevShopping = data.shopping;
        setData((prev) => ({ ...prev, shopping: [] }));

        try {
            const { error } = await supabase
                .from("shopping_items")
                .delete()
                .neq("id", "00000000-0000-0000-0000-000000000000");
            if (error) throw error;
        } catch (error) {
            console.error("Error resetting shopping:", error);
            setData((prev) => ({ ...prev, shopping: prevShopping }));
        }
    }, [data.shopping]);

    const addUser = useCallback(async (name: string, color: string) => {
        const tempId = `temp-${Date.now()}`;
        const newUser: User = { id: tempId, name, color };
        setData((prev) => ({ ...prev, users: [...prev.users, newUser] }));

        try {
            const { data: inserted, error } = await supabase
                .from("users")
                .insert({ name, color })
                .select()
                .single();

            if (error) throw error;

            if (inserted) {
                setData((prev) => ({
                    ...prev,
                    users: prev.users.map((u) =>
                        u.id === tempId ? { ...u, id: inserted.id } : u
                    ),
                }));
            }
        } catch (error) {
            console.error("Error adding user:", error);
            setData((prev) => ({
                ...prev,
                users: prev.users.filter((u) => u.id !== tempId),
            }));
        }
    }, []);

    const removeUser = useCallback(async (userId: string) => {
        const prevUsers = data.users;
        setData((prev) => ({
            ...prev,
            users: prev.users.filter((u) => u.id !== userId),
        }));

        try {
            const { error } = await supabase.from("users").delete().eq("id", userId);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting user:", error);
            setData((prev) => ({ ...prev, users: prevUsers }));
        }
    }, [data.users]);

    const addTask = useCallback(async (label: string, userId: string, color: string) => {
        const tempId = `temp-${Date.now()}`;
        const newTask: Task = { id: tempId, label, userId, color };
        setData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));

        try {
            const { data: inserted, error } = await supabase
                .from("tasks")
                .insert({ label, user_id: userId, color })
                .select()
                .single();

            if (error) throw error;

            if (inserted) {
                setData((prev) => ({
                    ...prev,
                    tasks: prev.tasks.map((t) =>
                        t.id === tempId ? { ...t, id: inserted.id } : t
                    ),
                }));
            }
        } catch (error) {
            console.error("Error adding task:", error);
            setData((prev) => ({
                ...prev,
                tasks: prev.tasks.filter((t) => t.id !== tempId),
            }));
        }
    }, []);

    const removeTask = useCallback(async (taskId: string) => {
        const prevTasks = data.tasks;
        setData((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((t) => t.id !== taskId),
        }));

        try {
            const { error } = await supabase.from("tasks").delete().eq("id", taskId);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting task:", error);
            setData((prev) => ({ ...prev, tasks: prevTasks }));
        }
    }, [data.tasks]);

    const removeShoppingItem = useCallback(async (itemId: string) => {
        const prevShopping = data.shopping;
        setData((prev) => ({
            ...prev,
            shopping: prev.shopping.filter((s) => s.id !== itemId),
        }));

        try {
            const { error } = await supabase.from("shopping_items").delete().eq("id", itemId);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting shopping item:", error);
            setData((prev) => ({ ...prev, shopping: prevShopping }));
        }
    }, [data.shopping]);

    if (!mounted) {
        return <LoadingScreen />;
    }

    return (
        <AppContext.Provider
            value={{
                data,
                isLoading: !mounted,
                refetchData: fetchData,
                setLocked,
                updateDinners,
                updateTasks,
                updateShopping,
                resetShopping,
                addUser,
                removeUser,
                addTask,
                removeTask,
                removeShoppingItem,
                addShoppingItem,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}
