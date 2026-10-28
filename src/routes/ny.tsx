import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Shell } from "@/components/Shell";
import { addTask, COLORS, toISO, type TaskColor } from "@/lib/tasks";

export const Route = createFileRoute("/ny")({
  validateSearch: (s: Record<string, unknown>): { date?: string } =>
    typeof s["date"] === "string" ? { date: s["date"] } : {},
  head: () => ({
    meta: [
      { title: "Lägg till en ny Task – To-do" },
      { name: "description", content: "Skapa en ny task med datum, emoji och färg." },
      { property: "og:title", content: "Lägg till en ny Task – To-do" },
      { property: "og:description", content: "Skapa en ny task med datum, emoji och färg." },
    ],
  }),
  component: NewTask,
});

function NewTask() {
  const { date: initial } = Route.useSearch();
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(initial ?? toISO(new Date()));
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState<TaskColor>("blue");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title: title.trim(), date, emoji, color });
    nav({ to: "/" });
  };

  return (
    <Shell>
      <form onSubmit={submit} className="bg-primary px-4 py-10">
        <h1 className="px-4 text-5xl">Lägg till en ny Task</h1>
        <div className="mb-8 flex gap-5 px-12 py-2">
          {COLORS.map((c) => (
            <button type="button" key={c} onClick={() => setColor(c)} aria-label={c}
              className={`h-4 w-4 rounded-full task-${c} ${color === c ? "ring-2 ring-foreground ring-offset-2" : ""}`} />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <input className="pill" placeholder="Task" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="pill" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="pill" placeholder="Emoji" maxLength={4} value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          <button type="submit" className="pill flex items-center justify-between">Spara <CirclePlus /></button>
        </div>
      </form>
      <p className="bg-muted px-6 py-16 text-center text-4xl leading-relaxed text-muted-foreground">
        Oh look,<br />she is on her phone<br />again.
      </p>
    </Shell>
  );
}
