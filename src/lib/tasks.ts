import { useSyncExternalStore } from "react";

export const COLORS = ["yellow", "red", "blue", "navy", "wine", "sun"] as const;
export type TaskColor = (typeof COLORS)[number];
export type Task = { id: string; title: string; date: string; emoji: string; color: TaskColor; done: boolean };

const KEY = "todo-tasks-v1";
let tasks: Task[] = [];
let loaded = false;
const listeners = new Set<() => void>();
const EMPTY: Task[] = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    tasks = JSON.parse(localStorage.getItem(KEY) || "null") ?? seed();
  } catch {
    tasks = seed();
  }
}
function seed(): Task[] {
  const d = (n: number) => toISO(addDays(new Date(), n));
  return [
    { id: "1", title: "Skicka paket (Vinted)", date: d(0), emoji: "📦", color: "sun", done: false },
    { id: "2", title: "Möte med Josefina", date: d(1), emoji: "☕", color: "red", done: false },
    { id: "3", title: "Intervju", date: d(2), emoji: "💼", color: "blue", done: false },
    { id: "4", title: "Middag med Nicki", date: d(4), emoji: "🍝", color: "wine", done: false },
  ];
}
function save(next: Task[]) {
  tasks = next;
  localStorage.setItem(KEY, JSON.stringify(tasks));
  listeners.forEach((l) => l());
}
export function useTasks() {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return tasks; },
    () => EMPTY,
  );
}
export const addTask = (t: Omit<Task, "id" | "done">) =>
  save([...tasks, { ...t, id: crypto.randomUUID(), done: false }]);
export const toggleTask = (id: string) =>
  save(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
export const deleteTask = (id: string) => save(tasks.filter((t) => t.id !== id));

export function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
export function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function startOfWeek(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; }
export function weekNumber(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - y.getTime()) / 86400000 + 1) / 7);
}
