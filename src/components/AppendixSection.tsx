import type { Activity } from "../types";
import { formatDriveBadge } from "../utils/planner";
import { Badge, SectionHeader } from "./ui";

type AppendixSectionProps = {
  activities: Activity[];
  onOpen: (activity: Activity) => void;
};

const genreMap: Array<{ title: string; matcher: (activity: Activity) => boolean }> = [
  { title: "Fishing", matcher: (activity) => activity.categories.includes("Fishing") },
  { title: "Sailing", matcher: (activity) => activity.categories.includes("Sailing") },
  {
    title: "Hiking / running",
    matcher: (activity) => activity.categories.some((category) => ["Hiking", "Outdoors", "Nature"].includes(category)),
  },
  { title: "Wine", matcher: (activity) => activity.categories.includes("Wine") },
  { title: "Cider", matcher: (activity) => activity.categories.includes("Cider") },
  { title: "Shopping", matcher: (activity) => activity.categories.includes("Shopping") },
  { title: "History", matcher: (activity) => activity.categories.includes("History") },
  {
    title: "Art / culture",
    matcher: (activity) => activity.categories.some((category) => ["Art", "Culture"].includes(category)),
  },
  { title: "Teen activities", matcher: (activity) => activity.categories.includes("Teen") || activity.teenAppealScore >= 4 },
  {
    title: "Nature / beaches",
    matcher: (activity) => activity.categories.some((category) => ["Nature", "Beach", "Water"].includes(category)),
  },
  { title: "Rainy day options", matcher: (activity) => activity.rainyDayFriendly },
];

export function AppendixSection({ activities, onOpen }: AppendixSectionProps) {
  return (
    <section id="appendix" className="scroll-mt-24 py-12">
      <SectionHeader
        eyebrow="More to tempt you"
        title="Ideas by mood"
        description="A scannable bank for filling gaps, splitting into smaller crews, or swapping plans when the weather changes."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {genreMap.map((genre) => {
          const matches = activities
            .filter(genre.matcher)
            .sort((a, b) => a.driveTimeMinutes - b.driveTimeMinutes || b.mustDoScore - a.mustDoScore);

          return (
            <article key={genre.title} className="rounded-sm border border-coast-blue/12 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-coast-slate">{genre.title}</h3>
                <Badge tone="sand">{matches.length}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {matches.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => onOpen(activity)}
                    className="w-full rounded-md border border-coast-blue/10 bg-coast-foam p-3 text-left transition hover:border-coast-blue/35 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={activity.distanceBand === "In Pornic" ? "green" : activity.driveTimeMinutes > 120 ? "coral" : "blue"}>
                        {formatDriveBadge(activity)}
                      </Badge>
                      <span className="text-sm font-black text-coast-slate">{activity.name}</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-coast-slate/60">
                      Must-do {activity.mustDoScore}/5 · Teen {activity.teenAppealScore}/5 · {activity.tripType}
                    </p>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
