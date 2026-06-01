import { Heart, Trash2 } from "lucide-react";
import type { Activity } from "../types";
import { formatDriveBadge } from "../utils/planner";
import { Badge, IconButton, SectionHeader } from "./ui";

type ShortlistPanelProps = {
  activities: Activity[];
  onOpen: (activity: Activity) => void;
  onRemove: (activity: Activity) => void;
};

export function ShortlistPanel({ activities, onOpen, onRemove }: ShortlistPanelProps) {
  const categoryMix = activities.reduce<Record<string, number>>((mix, activity) => {
    activity.categories.slice(0, 2).forEach((category) => {
      mix[category] = (mix[category] ?? 0) + 1;
    });
    return mix;
  }, {});

  const bigDayCount = activities.filter((activity) => activity.tripType === "Big day trip" || activity.effortLevel === "Big Day").length;
  const easyLocalCount = activities.filter(
    (activity) => activity.distanceBand === "In Pornic" || activity.distanceBand === "Under 30 min",
  ).length;

  return (
    <section id="shortlist" className="scroll-mt-24 py-12">
      <SectionHeader
        eyebrow="Decision support"
        title="Family shortlist"
        description="Shortlist picks persist after refresh and keep drive time visible, so the group can quickly see whether the plan is becoming too drive-heavy."
      />

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-lg border border-coast-blue/12 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-coast-coral text-coast-coral" />
            <h3 className="text-lg font-black text-coast-slate">Shortlist summary</h3>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <SummaryNumber label="Selected" value={activities.length} />
            <SummaryNumber label="Big days" value={bigDayCount} />
            <SummaryNumber label="Easy/local" value={easyLocalCount} />
          </div>

          <div className="mt-5 border-t border-coast-blue/10 pt-4">
            <h4 className="text-sm font-black uppercase tracking-[0.1em] text-coast-slate/55">Category mix</h4>
            {activities.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(categoryMix)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => (
                    <Badge key={category} tone="outline">
                      {category}: {count}
                    </Badge>
                  ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-coast-slate/65">
                Add activities from cards, details, or map popups to start comparing the mix.
              </p>
            )}
          </div>
        </aside>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activities.map((activity) => (
            <article key={activity.id} className="rounded-lg border border-coast-blue/12 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <button type="button" className="text-left" onClick={() => onOpen(activity)}>
                  <Badge tone={activity.driveTimeMinutes > 120 ? "coral" : activity.distanceBand === "In Pornic" ? "green" : "blue"}>
                    {formatDriveBadge(activity)}
                  </Badge>
                  <h3 className="mt-2 text-lg font-black leading-tight text-coast-slate">{activity.name}</h3>
                </button>
                <IconButton label={`Remove ${activity.name}`} onClick={() => onRemove(activity)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
              <p className="mt-3 text-sm leading-6 text-coast-slate/70">{activity.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="sand">{activity.tripType}</Badge>
                <Badge tone="outline">Must-do {activity.mustDoScore}/5</Badge>
                <Badge tone="outline">Teen {activity.teenAppealScore}/5</Badge>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryNumber({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-coast-foam p-3">
      <p className="text-2xl font-black text-coast-blue">{value}</p>
      <p className="mt-1 text-xs font-bold text-coast-slate/60">{label}</p>
    </div>
  );
}
