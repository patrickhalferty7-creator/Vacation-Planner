import { useState } from "react";
import {
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Clock3,
  ExternalLink,
  Heart,
  MapPin,
  Star,
  Umbrella,
  Users,
} from "lucide-react";
import type { Activity } from "../types";
import { formatDriveBadge, scoreLabel } from "../utils/planner";
import { Badge, TextButton, cx } from "./ui";

type ActivityCardProps = {
  activity: Activity;
  shortlisted: boolean;
  onOpen: (activity: Activity) => void;
  onToggleShortlist: (activity: Activity) => void;
  compact?: boolean;
};

const effortTone = {
  Easy: "green",
  Moderate: "sand",
  "Big Day": "coral",
} as const;

export function ActivityCard({
  activity,
  shortlisted,
  onOpen,
  onToggleShortlist,
  compact = false,
}: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.googleMapsQuery)}`;

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("[data-card-action]")) return;
    onOpen(activity);
  };

  return (
    <article
      className="group flex h-full cursor-pointer flex-col rounded-lg border border-coast-blue/12 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`${activity.name}, ${formatDriveBadge(activity)}`}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(activity);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {activity.rank ? <Badge tone="coral">#{activity.rank}</Badge> : null}
            <Badge tone={activity.driveTimeMinutes > 120 ? "coral" : activity.distanceBand === "In Pornic" ? "green" : "blue"}>
              <Clock3 className="mr-1 h-3.5 w-3.5" />
              {formatDriveBadge(activity)}
            </Badge>
          </div>
          <h3 className="text-xl font-black leading-tight text-coast-slate">{activity.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-coast-slate/60">
            <MapPin className="h-4 w-4" />
            {activity.location}
          </p>
        </div>
        <button
          data-card-action
          type="button"
          aria-label={shortlisted ? `Remove ${activity.name} from shortlist` : `Add ${activity.name} to shortlist`}
          title={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
          onClick={() => onToggleShortlist(activity)}
          className={cx(
            "grid h-10 w-10 shrink-0 place-items-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-coast-blue/30",
            shortlisted
              ? "border-coast-coral bg-coast-coral text-white"
              : "border-coast-blue/15 bg-coast-foam text-coast-blue hover:border-coast-blue/40",
          )}
        >
          <Heart className={cx("h-5 w-5", shortlisted && "fill-current")} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {activity.categories.slice(0, compact ? 3 : 5).map((category) => (
          <Badge key={category} tone="outline">
            {category}
          </Badge>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Score label="Must-do" value={activity.mustDoScore} />
        <Score label="Teen" value={activity.teenAppealScore} />
        <Score label="All ages" value={activity.allAgesScore} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone={effortTone[activity.effortLevel]}>{activity.effortLevel}</Badge>
        <Badge tone={activity.rainyDayFriendly ? "blue" : "sand"}>
          <Umbrella className="mr-1 h-3.5 w-3.5" />
          {activity.rainyDayFriendly ? "Rainy-day OK" : "Best dry"}
        </Badge>
        <Badge tone={activity.grandparentFriendly ? "green" : "outline"}>
          <Users className="mr-1 h-3.5 w-3.5" />
          {activity.grandparentFriendly ? "Grandparent-friendly" : "Active subgroup"}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-6 text-coast-slate/78">{activity.shortDescription}</p>

      {!compact && (
        <div className="mt-4 rounded-md bg-coast-foam p-3">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-coast-blue">Why we think you'll like it</p>
          <p className="mt-2 text-sm leading-6 text-coast-slate/78">{activity.whyWeThinkYoullLikeIt}</p>
        </div>
      )}

      {activity.rank && activity.driveTimeMinutes > 60 && activity.worthTheDriveNote ? (
        <div className="mt-3 rounded-md border border-coast-coral/25 bg-[#fff3ed] p-3">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-coast-coral">Why it's worth the drive</p>
          <p className="mt-1 text-sm leading-6 text-coast-slate/76">{activity.worthTheDriveNote}</p>
        </div>
      ) : null}

      <div className="mt-auto pt-4">
        <button
          data-card-action
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-coast-blue hover:text-coast-deep"
          aria-expanded={expanded}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? "Compact view" : "Expand quick facts"}
        </button>

        {expanded ? (
          <div className="mb-4 grid gap-3 border-t border-coast-blue/10 pt-3 text-sm text-coast-slate/78 sm:grid-cols-2">
            <Fact label="Trip type" value={activity.tripType} />
            <Fact label="Distance band" value={activity.distanceBand} />
            <Fact label="Duration" value={activity.estimatedDuration} />
            <Fact label="Best time" value={activity.bestTimeOfDay} />
            <Fact label="Best for" value={activity.bestFor.join(", ")} />
            <Fact label="Watch-outs" value={activity.watchOuts.join("; ")} />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <TextButton data-card-action type="button" onClick={() => onOpen(activity)}>
            View details
          </TextButton>
          <TextButton data-card-action type="button" variant="secondary" onClick={() => onToggleShortlist(activity)}>
            <Heart className={cx("h-4 w-4", shortlisted && "fill-current")} />
            {shortlisted ? "Shortlisted" : "Shortlist"}
          </TextButton>
          <TextButton data-card-action type="button" variant="secondary" title="Itinerary planning placeholder">
            <CalendarPlus className="h-4 w-4" />
            Itinerary
          </TextButton>
          <a
            data-card-action
            className="inline-flex items-center justify-center gap-2 rounded-md border border-coast-blue/20 bg-white px-4 py-2 text-sm font-bold text-coast-deep transition hover:bg-coast-foam focus:outline-none focus:ring-2 focus:ring-coast-blue/30"
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Maps
          </a>
        </div>
      </div>
    </article>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-coast-shell px-3 py-2">
      <div className="flex items-center gap-1 text-coast-coral">
        <Star className="h-3.5 w-3.5 fill-current" />
        <span className="font-black">{scoreLabel(value)}</span>
      </div>
      <p className="mt-1 text-xs font-bold text-coast-slate/60">{label}</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.08em] text-coast-slate/45">{label}</p>
      <p className="mt-1 font-semibold text-coast-slate">{value}</p>
    </div>
  );
}
