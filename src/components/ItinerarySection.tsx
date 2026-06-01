import { CalendarDays, GripVertical } from "lucide-react";
import { itineraries } from "../data/itineraries";
import { Badge, SectionHeader } from "./ui";

export function ItinerarySection() {
  return (
    <section id="itineraries" className="scroll-mt-24 py-12">
      <SectionHeader
        eyebrow="Sample plans"
        title="Suggested itineraries"
        description="Static for now, but structured in day blocks so future drag-and-drop planning can slot in cleanly."
      />

      <div className="grid gap-5">
        {itineraries.map((itinerary) => (
          <article key={itinerary.id} className="rounded-lg border border-coast-blue/12 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-coast-blue">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="text-xl font-black text-coast-slate">{itinerary.title}</h3>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-coast-slate/68">{itinerary.description}</p>
              </div>
              <Badge tone="sand">{itinerary.days.length} days</Badge>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {itinerary.days.map((day) => (
                <div key={`${itinerary.id}-${day.day}`} className="rounded-lg border border-coast-blue/10 bg-coast-foam p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-coast-slate/35" />
                      <h4 className="font-black text-coast-slate">Day {day.day}</h4>
                    </div>
                    <Badge tone={day.driveIntensity.toLowerCase().includes("big") ? "coral" : "outline"}>
                      {day.driveIntensity}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm leading-6">
                    <PlanSlot label="Morning" value={day.morning} />
                    <PlanSlot label="Afternoon" value={day.afternoon} />
                    <PlanSlot label="Evening" value={day.evening} />
                  </div>
                  <p className="mt-4 rounded-md bg-white p-3 text-sm font-semibold leading-6 text-coast-slate/70">
                    {day.notes}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlanSlot({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[95px_minmax(0,1fr)]">
      <p className="text-xs font-black uppercase tracking-[0.08em] text-coast-slate/45">{label}</p>
      <p className="font-semibold text-coast-slate">{value}</p>
    </div>
  );
}
