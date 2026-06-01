import { useCallback, useEffect, useMemo, useState } from "react";
import { Compass, Heart, Map, Route, Search, Sparkles, Users } from "lucide-react";
import heroImage from "./assets/pornic-coastal-hero.png";
import { activities, allCategories, topTenActivities } from "./data/activities";
import type { Activity, Filters, SortOption } from "./types";
import { filterActivities, formatDriveBadge, sortActivities } from "./utils/planner";
import { ActivityCard } from "./components/ActivityCard";
import { ActivityFilters } from "./components/ActivityFilters";
import { ActivityMap } from "./components/ActivityMap";
import { ActivityModal } from "./components/ActivityModal";
import { AppendixSection } from "./components/AppendixSection";
import { ComparisonMatrix } from "./components/ComparisonMatrix";
import { ItinerarySection } from "./components/ItinerarySection";
import { ShortlistPanel } from "./components/ShortlistPanel";
import { TopTenSection } from "./components/TopTenSection";
import { Badge, TextButton } from "./components/ui";

const initialFilters: Filters = {
  search: "",
  categories: [],
  distanceBands: [],
  minMustDo: 1,
  minTeenAppeal: 1,
  rainyDayOnly: false,
  effortLevels: [],
  wineCider: false,
  waterActivities: false,
  historyCulture: false,
  outdoors: false,
};

const shortlistStorageKey = "pornic-family-trip-shortlist";

function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [shortlistIds, setShortlistIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(shortlistStorageKey);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(shortlistStorageKey, JSON.stringify(shortlistIds));
  }, [shortlistIds]);

  const filteredActivities = useMemo(() => {
    return sortActivities(filterActivities(activities, filters), sort);
  }, [filters, sort]);

  const shortlistedActivities = useMemo(
    () => shortlistIds.map((id) => activities.find((activity) => activity.id === id)).filter(Boolean) as Activity[],
    [shortlistIds],
  );

  const closestActivity = useMemo(
    () => [...activities].sort((a, b) => a.driveTimeMinutes - b.driveTimeMinutes)[0],
    [],
  );

  const furthestTopTen = useMemo(
    () => [...topTenActivities].sort((a, b) => b.driveTimeMinutes - a.driveTimeMinutes)[0],
    [],
  );

  const handleOpenActivity = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
  }, []);

  const handleToggleShortlist = useCallback((activity: Activity) => {
    setShortlistIds((current) =>
      current.includes(activity.id) ? current.filter((id) => id !== activity.id) : [...current, activity.id],
    );
  }, []);

  return (
    <div className="min-h-screen bg-coast-shell text-coast-slate">
      <header className="sticky top-0 z-[1000] border-b border-coast-blue/10 bg-coast-shell/88 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="#overview" className="flex items-center gap-3 font-black text-coast-ink">
            <span className="grid h-9 w-9 place-items-center rounded-sm bg-coast-ink font-display text-white">P</span>
            <span className="leading-tight">
              Pornic
              <span className="block text-[10px] uppercase tracking-[0.24em] text-coast-coral">Atlantic guide</span>
            </span>
          </a>
          <div className="hidden flex-wrap items-center gap-2 md:flex">
            <NavLink href="#top-10">Top 10</NavLink>
            <NavLink href="#explorer">Explore</NavLink>
            <NavLink href="#map">Map</NavLink>
            <NavLink href="#compare">Compare</NavLink>
            <NavLink href="#shortlist">Shortlist</NavLink>
            <NavLink href="#itineraries">Itineraries</NavLink>
          </div>
          <a
            href="#shortlist"
            className="inline-flex items-center gap-2 rounded-sm bg-coast-coral px-3 py-2 text-sm font-black text-white shadow-sm"
          >
            <Heart className="h-4 w-4 fill-current" />
            {shortlistIds.length}
          </a>
        </nav>
      </header>

      <main>
        <section id="overview" className="scroll-mt-24">
          <div className="relative overflow-hidden">
            <img
              src={heroImage}
              alt="Atlantic harbor at golden hour with sailboats and coastal town atmosphere"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="hero-image-mask absolute inset-0" />
            <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-end px-4 py-12 md:py-16">
              <div className="max-w-4xl pb-10 text-white">
                <Badge tone="sand">Home base: Pornic, France</Badge>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-coast-sand/90">
                  Ten travelers. One Atlantic base. No wasted drives.
                </p>
                <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[0.98] md:text-7xl">
                  Pornic Family Trip Planner
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
                  A curated coastal field guide for choosing the days that feel worth it: island bike rides, private
                  fishing mornings, show-stopping history, Muscadet lunches, stylish city browsing, and big Atlantic
                  scenery, all measured from Pornic.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <HeroCta href="#top-10" icon={<Sparkles className="h-4 w-4" />} label="See the Top 10" />
                  <HeroCta href="#map" icon={<Map className="h-4 w-4" />} label="Open the Map" />
                  <HeroCta href="#explorer" icon={<Search className="h-4 w-4" />} label="Browse the Guide" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mx-auto -mt-8 grid max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<Compass className="h-5 w-5" />}
              label="Field guide"
              value={activities.length.toString()}
              detail="Curated activities from Pornic"
            />
            <StatCard
              icon={<Route className="h-5 w-5" />}
              label="First stroll"
              value={closestActivity.driveTimeLabel}
              detail={`${closestActivity.name} · ${formatDriveBadge(closestActivity)}`}
            />
            <StatCard
              icon={<Map className="h-5 w-5" />}
              label="Signature big day"
              value={furthestTopTen.driveTimeLabel}
              detail={furthestTopTen.name}
            />
            <StatCard
              icon={<Users className="h-5 w-5" />}
              label="Interests covered"
              value={allCategories.length.toString()}
              detail="Water, wine, teens, history, art, food"
            />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4">
          <TopTenSection
            shortlistIds={shortlistIds}
            onOpen={handleOpenActivity}
            onToggleShortlist={handleToggleShortlist}
          />

          <section id="explorer" className="scroll-mt-24 py-12">
            <ActivityFilters
              filters={filters}
              sort={sort}
              resultCount={filteredActivities.length}
              onFiltersChange={setFilters}
              onSortChange={setSort}
            />

            <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  shortlisted={shortlistIds.includes(activity.id)}
                  onOpen={handleOpenActivity}
                  onToggleShortlist={handleToggleShortlist}
                  compact
                />
              ))}
            </div>

            {!filteredActivities.length ? (
              <div className="mt-6 rounded-lg border border-coast-blue/12 bg-white p-8 text-center shadow-sm">
                <p className="text-xl font-black text-coast-slate">No activities match this filter mix.</p>
                <p className="mt-2 text-coast-slate/65">Loosen a drive-time or score filter and the guide will open back up.</p>
              </div>
            ) : null}
          </section>

          <ActivityMap activities={filteredActivities} onOpenActivity={handleOpenActivity} />

          <ComparisonMatrix
            activities={filteredActivities}
            shortlistIds={shortlistIds}
            onOpen={handleOpenActivity}
            onToggleShortlist={handleToggleShortlist}
          />

          <ShortlistPanel
            activities={shortlistedActivities}
            onOpen={handleOpenActivity}
            onRemove={handleToggleShortlist}
          />

          <ItinerarySection />

          <AppendixSection activities={activities} onOpen={handleOpenActivity} />
        </div>
      </main>

      <footer className="mt-10 border-t border-coast-blue/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm leading-6 text-coast-slate/65">
          Drive times and distances are planning estimates from Pornic and should be checked before booking or departure.
          Every view keeps the drive visible, because beautiful days are easier to choose when the car time is honest.
        </div>
      </footer>

      <ActivityModal
        activity={selectedActivity}
        shortlisted={selectedActivity ? shortlistIds.includes(selectedActivity.id) : false}
        onClose={() => setSelectedActivity(null)}
        onToggleShortlist={handleToggleShortlist}
      />
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="rounded-sm px-3 py-2 text-sm font-bold text-coast-slate/72 transition hover:bg-white hover:text-coast-deep" href={href}>
      {children}
    </a>
  );
}

function HeroCta({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-sm bg-white px-4 py-3 text-sm font-black text-coast-deep shadow-lg transition hover:-translate-y-0.5 hover:bg-coast-sand"
    >
      {icon}
      {label}
    </a>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="brochure-card rounded-sm border border-coast-blue/12 p-4 shadow-brochure">
      <div className="flex items-center gap-2 text-coast-blue">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.1em]">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-coast-ink">{value}</p>
      <p className="mt-1 text-sm font-semibold text-coast-slate/62">{detail}</p>
    </article>
  );
}

export default App;
