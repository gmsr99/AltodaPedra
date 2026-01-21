"use client";

import { clsx } from "clsx";

interface ColorPickerProps {
    colors: readonly string[];
    selected: string;
    onChange: (color: string) => void;
    size?: "sm" | "md";
    label?: string;
}

const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
};

export function ColorPicker({
    colors,
    selected,
    onChange,
    size = "md",
    label = "Selecionar cor",
}: ColorPickerProps) {
    return (
        <div
            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
            role="radiogroup"
            aria-label={label}
        >
            {colors.map((color) => (
                <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={selected === color}
                    aria-label={`Cor ${color.replace("bg-", "").replace("-500", "")}`}
                    onClick={() => onChange(color)}
                    className={clsx(
                        color,
                        sizeClasses[size],
                        "rounded-full shrink-0 ring-2 ring-offset-2 transition-all focus:outline-none focus-visible:ring-gray-600",
                        selected === color
                            ? "ring-gray-400 scale-110"
                            : "ring-transparent hover:scale-105"
                    )}
                />
            ))}
        </div>
    );
}
