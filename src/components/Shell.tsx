import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { COLORS, toggleTask, deleteTask, type Task } from "@/lib/tasks";

const links = [
  { to: "/", label: "Veckans To-do" },
  { to: "/vecka", label: "Vecka" },
  { to: "/alla", label: "Alla Tasks" },
  { to: "/ny", label: "Ny Task" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background font-hand text-foreground shadow-xl">
      <header className="relative flex items-center justify-between px-6 py-5">
        <button aria-label="Meny" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        <div className="frame" aria-hidden />
        {open && (
          <nav className="absolute left-4 top-16 z-10 flex flex-col gap-1 rounded-2xl bg-card p-3 text-2xl shadow-lg">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-1 hover:bg-secondary"
                activeProps={{ className: "bg-secondary" }}>{l.label}</Link>
            ))}
          </nav>
        )}
      </header>
      {children}
    </div>
  );
}

export function Dots() {
  return <div className="flex gap-4 py-1">{COLORS.map((c) => <span key={c} className={`h-2.5 w-2.5 rounded-full task-${c}`} />)}</div>;
}

export function TaskBlob({ t }: { t: Task }) {
  return (
    <div className={`blob task-${t.color} flex items-center justify-between gap-3 px-8 py-5 text-3xl ${t.done ? "opacity-50 line-through" : ""}`}>
      <span className="truncate">{t.emoji} {t.title}</span>
      <div className="flex shrink-0 items-center gap-2">
        <button onClick={() => deleteTask(t.id)} aria-label="Ta bort" className="text-xl opacity-60 hover:opacity-100">✕</button>
        <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} className="h-5 w-5 accent-foreground" aria-label="Klar" />
      </div>
    </div>
  );
}
