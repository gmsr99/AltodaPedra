/**
 * Days of week constants for the HOMEFLOW application
 */

// Days of week in Portuguese (Monday-first order for display)
export const DAYS_OF_WEEK = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
] as const;

// Days of week indexed by JavaScript Date.getDay() (0 = Sunday)
export const DAYS_JS_INDEX = [
    "Domingo",  // 0
    "Segunda",  // 1
    "Terça",    // 2
    "Quarta",   // 3
    "Quinta",   // 4
    "Sexta",    // 5
    "Sábado",   // 6
] as const;

// Get day name from JavaScript Date.getDay() index
export function getDayNameFromJsIndex(index: number): string {
    return DAYS_JS_INDEX[index] || "Segunda";
}

// Get order (1-7) from day name (Monday = 1)
export function getDayOrder(day: string): number {
    const index = DAYS_OF_WEEK.indexOf(day as typeof DAYS_OF_WEEK[number]);
    return index >= 0 ? index + 1 : 1;
}

// Get yesterday's day name
export function getYesterdayName(): string {
    const today = new Date().getDay();
    const yesterday = (today - 1 + 7) % 7;
    return DAYS_JS_INDEX[yesterday];
}

// Get today's day name
export function getTodayName(): string {
    return DAYS_JS_INDEX[new Date().getDay()];
}

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
