import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, TaskBlob } from "@/components/Shell";
import { useTasks, startOfWeek, addDays, toISO } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hej Katerina! – Veckans To-do" },
      { name: "description", content: "Din personliga to-do för veckan." },
      { property: "og:title", content: "Hej Katerina! – Veckans To-do" },
      { property: "og:description", content: "Din personliga to-do för veckan." },
    ],
  }),
  component: Index,
});

function Index() {
  const tasks = useTasks();
  const s = toISO(startOfWeek(new Date()));
  const e = toISO(addDays(startOfWeek(new Date()), 6));
  const week = tasks.filter((t) => t.date >= s && t.date <= e).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Shell>
      <h1 className="px-6 pb-8 text-7xl">Hej Katerina!</h1>
      <section className="min-h-[60vh] bg-primary px-4 py-6">
        <h2 className="mb-6 inline-block border-b border-foreground px-3 text-4xl">Veckans To-do</h2>
        <div className="flex flex-col gap-6">
          {week.map((t) => <TaskBlob key={t.id} t={t} />)}
          {week.length === 0 && <p className="text-2xl">Inget planerat. <Link to="/ny" className="underline">Lägg till en task</Link></p>}
        </div>
      </section>
    </Shell>
  );
}
