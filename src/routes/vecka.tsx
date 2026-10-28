import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CirclePlus } from "lucide-react";
import { Shell } from "@/components/Shell";
import { useTasks, startOfWeek, addDays, toISO, weekNumber } from "@/lib/tasks";

export const Route = createFileRoute("/vecka")({
  head: () => ({
    meta: [
      { title: "Veckovy – To-do" },
      { name: "description", content: "Se dina tasks dag för dag." },
      { property: "og:title", content: "Veckovy – To-do" },
      { property: "og:description", content: "Se dina tasks dag för dag." },
    ],
  }),
  component: Week,
});

const DAYS = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

function Week() {
  const [off, setOff] = useState(0);
  const tasks = useTasks();
  const start = addDays(startOfWeek(new Date()), off * 7);
  return (
    <Shell>
      <div className="flex items-center justify-center gap-6 pb-6 text-4xl">
        <button onClick={() => setOff(off - 1)} aria-label="Föregående"><ArrowLeft /></button>
        Vecka {weekNumber(start)}
        <button onClick={() => setOff(off + 1)} aria-label="Nästa"><ArrowRight /></button>
      </div>
      <div className="flex flex-col gap-6 px-6 pb-10">
        {DAYS.map((d, i) => {
          const iso = toISO(addDays(start, i));
          const list = tasks.filter((t) => t.date === iso);
          return (
            <div key={d} className="blob bg-primary px-8 py-5">
              <div className="flex items-center justify-between text-3xl">
                {d}
                <Link to="/ny" search={{ date: iso }} aria-label={`Lägg till ${d}`}><CirclePlus /></Link>
              </div>
              {list.map((t) => (
                <div key={t.id} className={`text-xl ${t.done ? "line-through opacity-60" : ""}`}>{t.emoji} {t.title}</div>
              ))}
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
