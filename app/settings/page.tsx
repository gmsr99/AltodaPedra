"use client";

import { useApp } from "@/context/AppContext";
import { useState, useEffect } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { USER_COLORS, TASK_COLOR_KEYS, TASK_COLOR_MAP } from "@/constants/colors";

export default function SettingsPage() {
    const { data, addUser, removeUser, addTask, removeTask } = useApp();
    const router = useRouter();

    const [newUserName, setNewUserName] = useState("");
    const [newUserColor, setNewUserColor] = useState<string>(USER_COLORS[0]);

    const [newTaskLabel, setNewTaskLabel] = useState("");
    const [newTaskUser, setNewTaskUser] = useState("");
    const [newTaskColorKey, setNewTaskColorKey] = useState<string>(TASK_COLOR_KEYS[0]);

    // Redirect if locked - using useEffect to avoid render-time navigation
    useEffect(() => {
        if (data.config.isLocked) {
            router.push("/jantares");
        }
    }, [data.config.isLocked, router]);

    // Initialize selected user when data loads
    useEffect(() => {
        if (!newTaskUser && data.users.length > 0) {
            setNewTaskUser(data.users[0].id);
        }
    }, [data.users, newTaskUser]);

    // Don't render if locked (will redirect)
    if (data.config.isLocked) {
        return null;
    }

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = newUserName.trim();
        if (!trimmedName) return;

        // Validation
        if (trimmedName.length < 2) {
            alert("O nome deve ter pelo menos 2 caracteres");
            return;
        }

        if (data.users.some((u) => u.name.toLowerCase() === trimmedName.toLowerCase())) {
            alert("Já existe um utilizador com este nome");
            return;
        }

        addUser(trimmedName, newUserColor);
        setNewUserName("");
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedLabel = newTaskLabel.trim();
        if (!trimmedLabel || !newTaskUser) return;

        addTask(trimmedLabel, newTaskUser, newTaskColorKey);
        setNewTaskLabel("");
    };

    const handleRemoveUser = (userId: string, userName: string) => {
        if (confirm(`Tem a certeza que quer remover "${userName}"?`)) {
            removeUser(userId);
        }
    };

    const handleRemoveTask = (taskId: string, taskLabel: string) => {
        if (confirm(`Tem a certeza que quer remover a tarefa "${taskLabel}"?`)) {
            removeTask(taskId);
        }
    };

    return (
        <div className="pb-24 pt-4">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/jantares"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Voltar para jantares"
                >
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-2xl font-bold">Definições</h2>
            </div>

            {/* Users Section */}
            <section className="mb-10" aria-labelledby="users-heading">
                <h3 id="users-heading" className="text-lg font-bold mb-4 flex items-center gap-2">
                    Agregado Familiar
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {data.users.length}
                    </span>
                </h3>

                <div className="grid grid-cols-1 gap-3 mb-4">
                    {data.users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={clsx(
                                        user.color,
                                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                    )}
                                >
                                    {user.name.substring(0, 2)}
                                </div>
                                <span className="font-medium text-black">{user.name}</span>
                            </div>
                            <button
                                onClick={() => handleRemoveUser(user.id, user.name)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label={`Remover ${user.name}`}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add User Form */}
                <form
                    onSubmit={handleAddUser}
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                >
                    <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">
                        Adicionar Pessoa
                    </h4>
                    <ColorPicker
                        colors={USER_COLORS}
                        selected={newUserColor}
                        onChange={setNewUserColor}
                        label="Selecionar cor do utilizador"
                    />
                    <div className="flex gap-2 mt-3">
                        <input
                            className="flex-1 px-3 py-2 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black outline-none text-black placeholder:text-gray-500"
                            placeholder="Nome..."
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            aria-label="Nome do novo utilizador"
                            minLength={2}
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </section>

            {/* Tasks Section */}
            <section aria-labelledby="tasks-heading">
                <h3 id="tasks-heading" className="text-lg font-bold mb-4 flex items-center gap-2">
                    Tarefas Base
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {data.tasks.length}
                    </span>
                </h3>

                <div className="grid grid-cols-1 gap-3 mb-4">
                    {data.tasks.map((task) => {
                        const owner = data.users.find((u) => u.id === task.userId);
                        const colorClass = TASK_COLOR_MAP[task.color] || "bg-gray-500";
                        return (
                            <div
                                key={task.id}
                                className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={clsx(colorClass, "w-3 h-10 rounded-full")} />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-black">{task.label}</span>
                                        <span className="text-xs text-gray-400">
                                            Atribuído a: {owner?.name || "???"}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveTask(task.id, task.label)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label={`Remover tarefa ${task.label}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Add Task Form */}
                <form
                    onSubmit={handleAddTask}
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                >
                    <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">
                        Nova Tarefa
                    </h4>

                    <div className="flex gap-2 mb-3">
                        {TASK_COLOR_KEYS.map((colorKey) => {
                            const colorClass = TASK_COLOR_MAP[colorKey];
                            return (
                                <button
                                    key={colorKey}
                                    type="button"
                                    onClick={() => setNewTaskColorKey(colorKey)}
                                    aria-label={`Cor ${colorKey}`}
                                    aria-pressed={newTaskColorKey === colorKey}
                                    className={clsx(
                                        colorClass,
                                        "w-8 h-8 rounded-full shrink-0 ring-2 ring-offset-2 transition-all",
                                        newTaskColorKey === colorKey
                                            ? "ring-gray-400 scale-110"
                                            : "ring-transparent"
                                    )}
                                />
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            className="w-full px-3 py-2 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-black outline-none text-black placeholder:text-gray-500"
                            placeholder="Nome da tarefa..."
                            value={newTaskLabel}
                            onChange={(e) => setNewTaskLabel(e.target.value)}
                            aria-label="Nome da nova tarefa"
                        />
                        <div className="flex gap-2">
                            <select
                                className="flex-1 px-3 py-2 rounded-xl border-none shadow-sm bg-white focus:ring-2 focus:ring-black outline-none appearance-none text-black"
                                value={newTaskUser}
                                onChange={(e) => setNewTaskUser(e.target.value)}
                                aria-label="Atribuir tarefa a"
                            >
                                {data.users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}
