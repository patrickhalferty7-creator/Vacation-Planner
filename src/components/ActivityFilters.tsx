import { Search, SlidersHorizontal, X } from "lucide-react";
import type { DistanceBand, EffortLevel, Filters, SortOption } from "../types";
import { allCategories } from "../data/activities";
import { distanceBandOrder } from "../utils/planner";
import { Badge, TextButton, cx } from "./ui";

type ActivityFiltersProps = {
  filters: Filters;
  sort: SortOption;
  resultCount: number;
  onFiltersChange: (filters: Filters) => void;
  onSortChange: (sort: SortOption) => void;
};

const effortLevels: EffortLevel[] = ["Easy", "Moderate", "Big Day"];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "recommended", label: "Recommended order" },
  { value: "closest", label: "Closest to Pornic" },
  { value: "furthest", label: "Furthest / biggest day trip" },
  { value: "valueForDrive", label: "Best value for drive time" },
  { value: "highestWithinHour", label: "Highest rated within 1 hour" },
  { value: "teenWithinHour", label: "Best teen appeal within 1 hour" },
  { value: "teen", label: "Highest teen appeal" },
  { value: "allAges", label: "Highest all-ages appeal" },
  { value: "rainy", label: "Best rainy-day options" },
];

export function ActivityFilters({
  filters,
  sort,
  resultCount,
  onFiltersChange,
  onSortChange,
}: ActivityFiltersProps) {
  const toggleCategory = (category: string) => {
    onFiltersChange({
      ...filters,
      categories: filters.categories.includes(category)
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category],
    });
  };

  const toggleDistance = (distanceBand: DistanceBand) => {
    onFiltersChange({
      ...filters,
      distanceBands: filters.distanceBands.includes(distanceBand)
        ? filters.distanceBands.filter((item) => item !== distanceBand)
        : [...filters.distanceBands, distanceBand],
    });
  };

  const toggleEffort = (effortLevel: EffortLevel) => {
    onFiltersChange({
      ...filters,
      effortLevels: filters.effortLevels.includes(effortLevel)
        ? filters.effortLevels.filter((item) => item !== effortLevel)
        : [...filters.effortLevels, effortLevel],
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      distanceBands: [],
      minMustDo: 1,
      minTeenAppeal: 1,
      rainyDayOnly: false,
      grandparentFriendlyOnly: false,
      effortLevels: [],
      wineCider: false,
      waterActivities: false,
      historyCulture: false,
      outdoors: false,
    });
  };

  return (
    <section className="rounded-lg border border-coast-blue/12 bg-white p-4 shadow-sm" aria-label="Activity filters">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-coast-blue" />
            <h3 className="text-lg font-black text-coast-slate">Activity Explorer</h3>
          </div>
          <p className="mt-1 text-sm font-semibold text-coast-slate/60">{resultCount} activities match these filters</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative min-w-[240px]">
            <span className="sr-only">Search activities</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coast-slate/45" />
            <input
              value={filters.search}
              onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
              placeholder="Search fishing, wine, teens..."
              className="h-11 w-full rounded-md border border-coast-blue/15 bg-coast-foam pl-10 pr-3 text-sm font-semibold text-coast-slate outline-none transition focus:border-coast-blue focus:ring-2 focus:ring-coast-blue/20"
            />
          </label>
          <label>
            <span className="sr-only">Sort activities</span>
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as SortOption)}
              className="h-11 w-full rounded-md border border-coast-blue/15 bg-white px-3 text-sm font-bold text-coast-slate outline-none transition focus:border-coast-blue focus:ring-2 focus:ring-coast-blue/20 sm:w-[260px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <FilterGroup title="Drive time from Pornic">
          {distanceBandOrder.map((distanceBand) => (
            <Chip
              key={distanceBand}
              selected={filters.distanceBands.includes(distanceBand)}
              onClick={() => toggleDistance(distanceBand)}
            >
              {distanceBand}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup title="Category">
          {allCategories.map((category) => (
            <Chip key={category} selected={filters.categories.includes(category)} onClick={() => toggleCategory(category)}>
              {category}
            </Chip>
          ))}
        </FilterGroup>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="text-sm font-black text-coast-slate" htmlFor="must-do-range">
            Must-do rating: {filters.minMustDo}+
          </label>
          <input
            id="must-do-range"
            type="range"
            min="1"
            max="5"
            value={filters.minMustDo}
            onChange={(event) => onFiltersChange({ ...filters, minMustDo: Number(event.target.value) })}
            className="mt-3 w-full accent-coast-blue"
          />
        </div>

        <div>
          <label className="text-sm font-black text-coast-slate" htmlFor="teen-range">
            Teen appeal: {filters.minTeenAppeal}+
          </label>
          <input
            id="teen-range"
            type="range"
            min="1"
            max="5"
            value={filters.minTeenAppeal}
            onChange={(event) => onFiltersChange({ ...filters, minTeenAppeal: Number(event.target.value) })}
            className="mt-3 w-full accent-coast-blue"
          />
        </div>

        <FilterGroup title="Effort level">
          {effortLevels.map((level) => (
            <Chip key={level} selected={filters.effortLevels.includes(level)} onClick={() => toggleEffort(level)}>
              {level}
            </Chip>
          ))}
        </FilterGroup>

        <div className="flex flex-wrap gap-2">
          <Toggle
            label="Rainy-day friendly"
            checked={filters.rainyDayOnly}
            onChange={(checked) => onFiltersChange({ ...filters, rainyDayOnly: checked })}
          />
          <Toggle
            label="Suitable for grandparents"
            checked={filters.grandparentFriendlyOnly}
            onChange={(checked) => onFiltersChange({ ...filters, grandparentFriendlyOnly: checked })}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge tone="sand">Interest shortcuts</Badge>
        <Toggle
          label="Wine/cider"
          checked={filters.wineCider}
          onChange={(checked) => onFiltersChange({ ...filters, wineCider: checked })}
        />
        <Toggle
          label="Water activities"
          checked={filters.waterActivities}
          onChange={(checked) => onFiltersChange({ ...filters, waterActivities: checked })}
        />
        <Toggle
          label="History/culture"
          checked={filters.historyCulture}
          onChange={(checked) => onFiltersChange({ ...filters, historyCulture: checked })}
        />
        <Toggle
          label="Outdoors"
          checked={filters.outdoors}
          onChange={(checked) => onFiltersChange({ ...filters, outdoors: checked })}
        />
        <TextButton type="button" variant="ghost" onClick={resetFilters} className="ml-auto">
          <X className="h-4 w-4" />
          Reset
        </TextButton>
      </div>
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-black text-coast-slate">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-coast-blue/25",
        selected
          ? "border-coast-blue bg-coast-blue text-white"
          : "border-coast-blue/15 bg-coast-foam text-coast-slate hover:border-coast-blue/40",
      )}
    >
      {children}
    </button>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cx(
        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition",
        checked
          ? "border-coast-blue bg-coast-blue text-white"
          : "border-coast-blue/15 bg-white text-coast-slate hover:border-coast-blue/40",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-3.5 w-3.5 accent-coast-blue"
      />
      {label}
    </label>
  );
}
