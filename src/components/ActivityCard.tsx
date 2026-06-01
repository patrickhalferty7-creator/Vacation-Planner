import { useState } from "react";
import { ChevronDown, ChevronUp, Clock3, ExternalLink, Heart, MapPin, Star, Umbrella } from "lucide-react";
import type { Activity } from "../types";
import { formatDriveBadge, getCategoryColor, scoreLabel } from "../utils/planner";
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
  const categoryColor = getCategoryColor(activity);
  const coverStyle = {
    background: `linear-gradient(135deg, ${categoryColor} 0%, #16465a 58%, #152a31 100%)`,
  };
  const coverLabel = activity.categories.slice(0, 2).join(" / ");

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("[data-card-action]")) return;
    onOpen(activity);
  };

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-sm border border-coast-blue/12 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-brochure"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`${activity.name}, ${formatDriveBadge(activity)}`}
      onKeyDown={(event) => {
        if (event.key === "Enter") onOpen(activity);
      }}
    >
      <div className="relative h-48 w-full overflow-hidden bg-coast-ink">
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            style={coverStyle}
            className="travel-card-cover h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-coast-ink/86 via-coast-ink/18 to-coast-ink/6" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {activity.rank ? (
              <span className="inline-flex h-7 items-center rounded-sm bg-coast-coral px-2.5 text-xs font-black text-white shadow-md">
                #{activity.rank}
              </span>
            ) : null}
            <span className="inline-flex h-7 items-center gap-1 rounded-sm bg-white/92 px-2.5 text-xs font-black text-coast-ink shadow-md backdrop-blur">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDriveBadge(activity)}
            </span>
          </div>

          <button
            data-card-action
            type="button"
            aria-label={shortlisted ? `Remove ${activity.name} from shortlist` : `Add ${activity.name} to shortlist`}
            title={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
            onClick={() => onToggleShortlist(activity)}
            className={cx(
              "grid h-8 w-8 place-items-center rounded-full border shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-coast-blue/30 active:scale-90",
              shortlisted
                ? "border-coast-coral bg-coast-coral text-white"
                : "border-white/25 bg-white/88 text-coast-blue backdrop-blur hover:bg-white hover:text-coast-deep",
            )}
          >
            <Heart className={cx("h-4 w-4", shortlisted && "fill-current")} />
          </button>
        </div>

        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-coast-sand/90">{coverLabel}</p>
          <p className="mt-1 font-display text-2xl font-bold leading-tight">{activity.location}</p>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={activity.driveTimeMinutes > 120 ? "coral" : activity.distanceBand === "In Pornic" ? "green" : "blue"}>
            <Clock3 className="mr-1 h-3.5 w-3.5" />
            {formatDriveBadge(activity)}
          </Badge>
          <Badge tone="outline" className="border-coast-gold/45 text-coast-ink">
            {activity.tripType}
          </Badge>
        </div>

        <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-coast-ink transition duration-300 group-hover:text-coast-blue">
          {activity.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-coast-slate/60">
          <MapPin className="h-4 w-4" />
          {activity.location}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {activity.categories.slice(0, compact ? 3 : 5).map((category) => (
            <Badge key={category} tone="outline" className="border-coast-blue/12 px-2 py-0.5 text-[10px]">
              {category}
            </Badge>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <Score label="Worth it" value={activity.mustDoScore} />
          <Score label="Teen spark" value={activity.teenAppealScore} />
          <Score label="Group pull" value={activity.allAgesScore} />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone={effortTone[activity.effortLevel]} className="px-2 py-0.5 text-[10px]">
            {activity.effortLevel}
          </Badge>
          <Badge tone={activity.rainyDayFriendly ? "blue" : "sand"} className="px-2 py-0.5 text-[10px]">
            <Umbrella className="mr-1 h-3.5 w-3.5" />
            {activity.rainyDayFriendly ? "Weatherproof" : "Best in sun"}
          </Badge>
        </div>

        <p className="mt-4 line-clamp-3 flex-grow text-sm leading-6 text-coast-slate/78">{activity.shortDescription}</p>

        <div className="mt-4 border-l-2 border-coast-gold bg-coast-shell px-3 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-coast-coral">
            Why we think you'll love it
          </p>
          <p className={cx("mt-2 text-sm leading-6 text-coast-slate/78", compact && "line-clamp-3")}>
            {activity.whyWeThinkYoullLikeIt}
          </p>
        </div>

        {activity.rank && activity.driveTimeMinutes > 60 && activity.worthTheDriveNote ? (
          <div className="mt-3 border-l-2 border-coast-coral bg-[#fff3ed] px-3 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-coast-coral">
              Why it's worth the drive
            </p>
            <p className="mt-1 text-sm leading-6 text-coast-slate/76">{activity.worthTheDriveNote}</p>
          </div>
        ) : null}

        <div className="mt-auto pt-4">
          <button
            data-card-action
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-coast-blue transition hover:text-coast-deep"
            aria-expanded={expanded}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Hide quick facts" : "Open quick facts"}
          </button>

          {expanded ? (
            <div className="mb-4 grid gap-3 border-t border-coast-blue/10 pt-3 text-xs text-coast-slate/78 sm:grid-cols-2">
              <Fact label="Distance band" value={activity.distanceBand} />
              <Fact label="Duration" value={activity.estimatedDuration} />
              <Fact label="Best time" value={activity.bestTimeOfDay} />
              <Fact label="Best for" value={activity.bestFor.join(", ")} />
              <Fact label="Pairs well with" value={(activity.pairsWellWith ?? ["Local Pornic time"]).join(", ")} />
              <Fact label="Watch-outs" value={activity.watchOuts.join("; ")} />
            </div>
          ) : null}

          <div className="flex flex-wrap gap-1.5">
            <TextButton data-card-action type="button" className="flex-grow py-2 text-xs shadow-sm" onClick={() => onOpen(activity)}>
              Open details
            </TextButton>
            <a
              data-card-action
              className="inline-flex items-center justify-center gap-1 rounded-sm border border-coast-blue/20 bg-white px-3 py-2 text-xs font-bold text-coast-deep shadow-sm transition hover:bg-coast-foam focus:outline-none focus:ring-2 focus:ring-coast-blue/30"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Maps
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-coast-blue/5 bg-coast-shell/70 px-3 py-2 shadow-sm">
      <div className="flex items-center gap-1 text-coast-coral">
        <Star className="h-3.5 w-3.5 fill-current" />
        <span className="text-sm font-black">{scoreLabel(value)}</span>
      </div>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-coast-slate/50">{label}</p>
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
