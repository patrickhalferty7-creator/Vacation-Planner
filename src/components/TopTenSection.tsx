import type { Activity } from "../types";
import { topTenActivities } from "../data/activities";
import { ActivityCard } from "./ActivityCard";
import { SectionHeader } from "./ui";

type TopTenSectionProps = {
  shortlistIds: string[];
  onOpen: (activity: Activity) => void;
  onToggleShortlist: (activity: Activity) => void;
};

export function TopTenSection({ shortlistIds, onOpen, onToggleShortlist }: TopTenSectionProps) {
  return (
    <section id="top-10" className="scroll-mt-24 py-12">
      <SectionHeader
        eyebrow="Ranked for this family"
        title="Top 10 recommendations"
        description="Prioritized for a multi-generational group of 10 with teens, water lovers, hikers/runners, shoppers, wine/cider fans, history buffs, and coastal-town browsers."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {topTenActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            shortlisted={shortlistIds.includes(activity.id)}
            onOpen={onOpen}
            onToggleShortlist={onToggleShortlist}
          />
        ))}
      </div>
    </section>
  );
}
