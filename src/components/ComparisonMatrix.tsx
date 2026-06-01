import type { Activity } from "../types";
import { formatDriveBadge, getComparisonBucket } from "../utils/planner";
import { Badge, SectionHeader } from "./ui";

type ComparisonMatrixProps = {
  activities: Activity[];
  shortlistIds: string[];
  onOpen: (activity: Activity) => void;
  onToggleShortlist: (activity: Activity) => void;
};

const buckets = [
  {
    title: "Close + Must-Do",
    description: "Prioritize these first. They are easy wins from Pornic.",
    tone: "green",
  },
  {
    title: "Close + Optional",
    description: "Good fillers, split-group ideas, or weather backups.",
    tone: "blue",
  },
  {
    title: "Far + Worth It",
    description: "Reserve energy, book ahead, and make the drive count.",
    tone: "coral",
  },
  {
    title: "Far + Probably Skip",
    description: "Only keep if someone in the group is strongly excited.",
    tone: "sand",
  },
] as const;

export function ComparisonMatrix({ activities, shortlistIds, onOpen, onToggleShortlist }: ComparisonMatrixProps) {
  return (
    <section id="compare" className="scroll-mt-24 py-12">
      <SectionHeader
        eyebrow="Worth the drive"
        title="Drive time vs must-do"
        description="The quick gut-check for group debate: what is close and irresistible, what is easy filler, and what deserves a proper car day from Pornic."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {buckets.map((bucket) => {
          const bucketActivities = activities
            .filter((activity) => getComparisonBucket(activity) === bucket.title)
            .sort((a, b) => b.mustDoScore - a.mustDoScore || a.driveTimeMinutes - b.driveTimeMinutes);

          return (
            <article key={bucket.title} className="rounded-sm border border-coast-blue/12 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone={bucket.tone}>{bucket.title}</Badge>
                  <p className="mt-2 text-sm leading-6 text-coast-slate/65">{bucket.description}</p>
                </div>
                <span className="rounded-full bg-coast-foam px-3 py-1 text-sm font-black text-coast-blue">
                  {bucketActivities.length}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {bucketActivities.map((activity) => {
                  const shortlisted = shortlistIds.includes(activity.id);
                  return (
                    <div key={activity.id} className="rounded-sm border border-coast-blue/10 bg-coast-foam p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <button type="button" className="text-left" onClick={() => onOpen(activity)}>
                          <Badge tone={activity.driveTimeMinutes > 120 ? "coral" : activity.distanceBand === "In Pornic" ? "green" : "blue"}>
                            {formatDriveBadge(activity)}
                          </Badge>
                          <h3 className="mt-2 font-black text-coast-slate">{activity.name}</h3>
                          <p className="mt-1 text-sm font-semibold text-coast-slate/60">
                            Must-do {activity.mustDoScore}/5 · Teen {activity.teenAppealScore}/5 · {activity.tripType}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleShortlist(activity)}
                          className="rounded-md border border-coast-blue/15 bg-white px-3 py-2 text-xs font-black text-coast-deep transition hover:bg-coast-shell"
                        >
                          {shortlisted ? "Shortlisted" : "Shortlist"}
                        </button>
                      </div>
                      {activity.worthTheDriveNote && activity.driveTimeMinutes > 60 ? (
                        <p className="mt-3 rounded-md bg-white p-3 text-sm leading-6 text-coast-slate/70">
                          {activity.worthTheDriveNote}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
