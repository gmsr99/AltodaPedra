/**
 * Database types for Supabase tables
 * These match the snake_case naming convention used in the database
 */

export interface DbAppConfig {
    id: number;
    is_locked: boolean;
}

export interface DbUser {
    id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface DbTask {
    id: string;
    label: string;
    user_id: string | null;
    color: string;
    created_at: string;
}

export interface DbDinner {
    day: string;
    user_id: string | null;
    dish: string;
    order: number;
}

export interface DbShoppingItem {
    id: string;
    item: string;
    type: "general" | "dinner";
    day: string | null;
    done: boolean;
    created_at: string;
}

/**
 * Database schema type for Supabase client
 */
export interface Database {
    public: {
        Tables: {
            app_config: {
                Row: DbAppConfig;
                Insert: Partial<DbAppConfig> & { id?: number };
                Update: Partial<DbAppConfig>;
            };
            users: {
                Row: DbUser;
                Insert: { name: string; color: string };
                Update: Partial<{ name: string; color: string }>;
            };
            tasks: {
                Row: DbTask;
                Insert: { label: string; user_id?: string | null; color: string };
                Update: Partial<{ label: string; user_id: string | null; color: string }>;
            };
            weekly_dinners: {
                Row: DbDinner;
                Insert: { day: string; user_id?: string | null; dish?: string; order: number };
                Update: Partial<{ user_id: string | null; dish: string; order: number }>;
            };
            shopping_items: {
                Row: DbShoppingItem;
                Insert: { item: string; type?: "general" | "dinner"; day?: string | null; done?: boolean };
                Update: Partial<{ item: string; type: "general" | "dinner"; day: string | null; done: boolean }>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
    };
}
