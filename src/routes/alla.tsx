import { createFileRoute } from "@tanstack/react-router";
import { Shell, Dots } from "@/components/Shell";
import { useTasks, toggleTask, addDays, toISO, type Task } from "@/lib/tasks";

export const Route = createFileRoute("/alla")({
  head: () => ({
    meta: [
      { title: "Alla Tasks – To-do" },
      { name: "description", content: "Idag, imorgon och kommande tasks." },
      { property: "og:title", content: "Alla Tasks – To-do" },
      { property: "og:description", content: "Idag, imorgon och kommande tasks." },
    ],
  }),
  component: All,
});

function Group({ title, list }: { title: string; list: Task[] }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-5xl">{title}</h2>
      <ul className="px-3">
        {list.map((t) => (
          <li key={t.id} className="flex items-center gap-3 border-b border-foreground/60 py-1 text-2xl">
            <span className={`h-2.5 w-2.5 rounded-full task-${t.color}`} />
            <button onClick={() => toggleTask(t.id)} className={`flex-1 text-left ${t.done ? "line-through opacity-50" : ""}`}>
              {t.emoji} {t.title}
            </button>
            <span className="text-base opacity-60">{t.date.slice(5)}</span>
          </li>
        ))}
        {list.length === 0 && <li className="border-b border-foreground/60 py-1 text-2xl opacity-40">—</li>}
      </ul>
    </section>
  );
}

function All() {
  const tasks = [...useTasks()].sort((a, b) => a.date.localeCompare(b.date));
  const today = toISO(new Date());
  const tom = toISO(addDays(new Date(), 1));
  return (
    <Shell>
      <div className="px-8 pb-10">
        <h1 className="text-5xl">Alla Tasks</h1>
        <Dots />
        <div className="mt-10">
          <Group title="Idag" list={tasks.filter((t) => t.date <= today)} />
          <Group title="Imorgon" list={tasks.filter((t) => t.date === tom)} />
          <Group title="Kommande" list={tasks.filter((t) => t.date > tom)} />
        </div>
      </div>
    </Shell>
  );
}
