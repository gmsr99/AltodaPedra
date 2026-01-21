export interface User {
  id: string;
  name: string;
  color: string; // Tailwind class e.g. "bg-orange-500"
}

export interface Task {
  id: string;
  label: string;
  userId: string;
  color: string; // "green", "blue" etc. - mapped to Tailwind classes via TASK_COLOR_MAP
}

export interface Dinner {
  day: string; // "Segunda", "Terça"...
  userId: string | null;
  dish: string;
  order?: number; // 1-7, Monday = 1
}

export interface ShoppingItem {
  id: string;
  item: string;
  type: "general" | "dinner";
  day?: string; // If type is dinner
  done: boolean;
}

export interface AppConfig {
  isLocked: boolean;
}

export interface AppData {
  config: AppConfig;
  users: User[];
  tasks: Task[];
  dinners: Dinner[];
  shopping: ShoppingItem[];
}
