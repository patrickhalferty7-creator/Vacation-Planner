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
        eyebrow="Editor's shortlist"
        title="Ten trips worth circling"
        description="The strongest first-pass picks for a group of 10: spectacle, sea air, wine country, market mornings, fishing, sailing, shopping, and coastal towns that feel worth the car time."
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
