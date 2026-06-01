import { CalendarPlus, Clock3, ExternalLink, Heart, Navigation, X } from "lucide-react";
import type { Activity } from "../types";
import { formatDriveBadge } from "../utils/planner";
import { Badge, IconButton, TextButton } from "./ui";

type ActivityModalProps = {
  activity: Activity | null;
  shortlisted: boolean;
  onClose: () => void;
  onToggleShortlist: (activity: Activity) => void;
};

export function ActivityModal({ activity, shortlisted, onClose, onToggleShortlist }: ActivityModalProps) {
  if (!activity) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.googleMapsQuery)}`;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end bg-coast-slate/60 p-0 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-dialog-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg bg-coast-shell shadow-2xl md:mx-auto md:max-w-4xl md:rounded-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-coast-blue/10 bg-coast-shell/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <Badge tone={activity.driveTimeMinutes > 120 ? "coral" : activity.distanceBand === "In Pornic" ? "green" : "blue"}>
              <Clock3 className="mr-1 h-3.5 w-3.5" />
              {formatDriveBadge(activity)}
            </Badge>
            <h2 id="activity-dialog-title" className="mt-2 text-2xl font-black leading-tight text-coast-slate">
              {activity.name}
            </h2>
          </div>
          <IconButton label="Close details" onClick={onClose}>
            <X className="h-5 w-5" />
          </IconButton>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              {activity.categories.map((category) => (
                <Badge key={category} tone="outline">
                  {category}
                </Badge>
              ))}
            </div>

            <p className="mt-4 text-lg leading-8 text-coast-slate/78">{activity.shortDescription}</p>

            <section className="mt-5 rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-coast-blue">Why we think you'll like it</h3>
              <p className="mt-3 leading-7 text-coast-slate/78">{activity.whyWeThinkYoullLikeIt}</p>
            </section>

            {activity.worthTheDriveNote ? (
              <section className="mt-4 rounded-lg border border-coast-coral/25 bg-[#fff3ed] p-4">
                <h3 className="text-sm font-black uppercase tracking-[0.1em] text-coast-coral">Why it's worth the drive</h3>
                <p className="mt-3 leading-7 text-coast-slate/78">{activity.worthTheDriveNote}</p>
              </section>
            ) : null}

            <section className="mt-5 grid gap-3 sm:grid-cols-3">
              <ScorePanel label="Must-do" value={activity.mustDoScore} />
              <ScorePanel label="Teen appeal" value={activity.teenAppealScore} />
              <ScorePanel label="All-ages fit" value={activity.allAgesScore} />
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-coast-slate/55">From Pornic</h3>
              <dl className="mt-4 grid gap-4">
                <Detail label="Drive time" value={activity.driveTimeLabel} />
                <Detail label="Distance band" value={activity.distanceBand} />
                <Detail label="Approx distance" value={activity.distanceKm ? `${activity.distanceKm} km` : "Not listed"} />
                <Detail label="Suggested trip type" value={activity.tripType} />
                <Detail label="Best time of day" value={activity.bestTimeOfDay} />
                <Detail label="Coordinates" value={`${activity.latitude.toFixed(4)}, ${activity.longitude.toFixed(4)}`} />
              </dl>
            </section>

            <section className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-coast-slate/55">Planning fit</h3>
              <div className="mt-4 grid gap-3">
                <Detail label="Suggested duration" value={activity.estimatedDuration} />
                <Detail label="Effort level" value={activity.effortLevel} />
                <Detail label="Rainy-day suitability" value={activity.rainyDayFriendly ? "Good option" : "Best in dry weather"} />
                <Detail label="Grandparents" value={activity.grandparentFriendly ? "Suitable with normal pacing" : "Better as an active subgroup"} />
              </div>
            </section>

            <section className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-coast-slate/55">Pairs well with</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(activity.pairsWellWith ?? ["Local Pornic time"]).map((pairing) => (
                  <Badge key={pairing} tone="sand">
                    {pairing}
                  </Badge>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-coast-slate/55">Watch-outs</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-coast-slate/78">
                {activity.watchOuts.map((watchOut) => (
                  <li key={watchOut}>• {watchOut}</li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap gap-2">
              <TextButton type="button" onClick={() => onToggleShortlist(activity)}>
                <Heart className={shortlisted ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                {shortlisted ? "Remove shortlist" : "Add shortlist"}
              </TextButton>
              <TextButton type="button" variant="secondary" title="Itinerary planning placeholder">
                <CalendarPlus className="h-4 w-4" />
                Itinerary
              </TextButton>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-md border border-coast-blue/20 bg-white px-4 py-2 text-sm font-bold text-coast-deep transition hover:bg-coast-foam focus:outline-none focus:ring-2 focus:ring-coast-blue/30"
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Google Maps
              </a>
            </div>
          </aside>
        </div>

        <div className="border-t border-coast-blue/10 bg-white px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-coast-slate/70">
            <Navigation className="h-4 w-4 text-coast-blue" />
            Pornic stays fixed as the home base for every drive-time estimate.
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.08em] text-coast-slate/45">{label}</dt>
      <dd className="mt-1 font-semibold text-coast-slate">{value}</dd>
    </div>
  );
}

function ScorePanel({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-coast-foam p-4">
      <p className="text-3xl font-black text-coast-blue">{value}/5</p>
      <p className="mt-1 text-sm font-bold text-coast-slate/65">{label}</p>
    </div>
  );
}
