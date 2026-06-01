import type { Activity, DistanceBand, Filters, SortOption } from "../types";

export const pornicHomeBase = {
  name: "Pornic home base",
  latitude: 47.1156,
  longitude: -2.1033,
};

export const distanceBandOrder: DistanceBand[] = [
  "In Pornic",
  "Under 30 min",
  "30–60 min",
  "1–2 hrs",
  "2–3 hrs",
];

export const formatDriveBadge = (activity: Activity) => {
  if (activity.distanceBand === "In Pornic") return "In Pornic";
  if (activity.driveTimeMinutes > 120) {
    return `Big day: ${activity.driveTimeLabel}`;
  }
  return `${activity.driveTimeLabel} from Pornic`;
};

export const scoreLabel = (score: number) => `${score}/5`;

export const driveValueScore = (activity: Activity) => {
  const fit = activity.mustDoScore * 1.5 + activity.allAgesScore + activity.teenAppealScore;
  const drivePenalty = Math.max(activity.driveTimeMinutes, 10) / 45;
  return fit / drivePenalty;
};

export const filterActivities = (activities: Activity[], filters: Filters) => {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return activities.filter((activity) => {
    const haystack = [
      activity.name,
      activity.location,
      activity.shortDescription,
      activity.whyWeThinkYoullLikeIt,
      ...activity.categories,
      ...activity.bestFor,
    ]
      .join(" ")
      .toLowerCase();

    if (normalizedSearch && !haystack.includes(normalizedSearch)) return false;
    if (filters.categories.length && !activity.categories.some((category) => filters.categories.includes(category))) {
      return false;
    }
    if (filters.distanceBands.length && !filters.distanceBands.includes(activity.distanceBand)) return false;
    if (activity.mustDoScore < filters.minMustDo) return false;
    if (activity.teenAppealScore < filters.minTeenAppeal) return false;
    if (filters.rainyDayOnly && !activity.rainyDayFriendly) return false;
    if (filters.grandparentFriendlyOnly && !activity.grandparentFriendly) return false;
    if (filters.effortLevels.length && !filters.effortLevels.includes(activity.effortLevel)) return false;
    const activeShortcutCategories: string[] = [];
    if (filters.wineCider) activeShortcutCategories.push("Wine", "Cider", "Food");
    if (filters.waterActivities) activeShortcutCategories.push("Water", "Fishing", "Sailing", "Beach");
    if (filters.historyCulture) activeShortcutCategories.push("History", "Art", "Culture");
    if (filters.outdoors) activeShortcutCategories.push("Outdoors", "Nature", "Hiking", "Beach");

    if (activeShortcutCategories.length > 0) {
      const matchesAnyShortcut = activity.categories.some((category) =>
        activeShortcutCategories.includes(category),
      );
      if (!matchesAnyShortcut) return false;
    }
    return true;
  });
};

export const sortActivities = (activities: Activity[], sort: SortOption) => {
  const ranked = [...activities];

  switch (sort) {
    case "closest":
      return ranked.sort((a, b) => a.driveTimeMinutes - b.driveTimeMinutes);
    case "furthest":
      return ranked.sort((a, b) => b.driveTimeMinutes - a.driveTimeMinutes);
    case "valueForDrive":
      return ranked.sort((a, b) => driveValueScore(b) - driveValueScore(a));
    case "highestWithinHour":
      return ranked.sort((a, b) => {
        const aPenalty = a.driveTimeMinutes <= 60 ? 0 : 100;
        const bPenalty = b.driveTimeMinutes <= 60 ? 0 : 100;
        return aPenalty - bPenalty || b.mustDoScore - a.mustDoScore || a.driveTimeMinutes - b.driveTimeMinutes;
      });
    case "teenWithinHour":
      return ranked.sort((a, b) => {
        const aPenalty = a.driveTimeMinutes <= 60 ? 0 : 100;
        const bPenalty = b.driveTimeMinutes <= 60 ? 0 : 100;
        return aPenalty - bPenalty || b.teenAppealScore - a.teenAppealScore || a.driveTimeMinutes - b.driveTimeMinutes;
      });
    case "teen":
      return ranked.sort((a, b) => b.teenAppealScore - a.teenAppealScore || a.driveTimeMinutes - b.driveTimeMinutes);
    case "allAges":
      return ranked.sort((a, b) => b.allAgesScore - a.allAgesScore || a.driveTimeMinutes - b.driveTimeMinutes);
    case "rainy":
      return ranked.sort((a, b) => Number(b.rainyDayFriendly) - Number(a.rainyDayFriendly) || b.mustDoScore - a.mustDoScore);
    case "recommended":
    default:
      return ranked.sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99) || b.mustDoScore - a.mustDoScore);
  }
};

export const getComparisonBucket = (activity: Activity) => {
  const close = activity.driveTimeMinutes <= 60;
  const mustDo = activity.mustDoScore >= 4;
  if (close && mustDo) return "Close + Must-Do";
  if (close && !mustDo) return "Close + Optional";
  if (!close && mustDo) return "Far + Worth It";
  return "Far + Probably Skip";
};

export const categoryColors: Record<string, string> = {
  "Theme Park": "#d9785f",
  Sightseeing: "#196b85",
  History: "#7a5c9f",
  Culture: "#7a5c9f",
  Art: "#c36d94",
  Water: "#1c7894",
  "Coastal Town": "#196b85",
  Fishing: "#2d7d78",
  Sailing: "#2f80a7",
  Outdoors: "#4f7258",
  Hiking: "#6d8f75",
  Nature: "#6d8f75",
  Beach: "#2b8b9f",
  Wine: "#9a4c65",
  Cider: "#b88232",
  Food: "#b88232",
  Shopping: "#5e6c84",
  Teen: "#d9785f",
  "Rainy Day": "#5e6c84",
  Wellness: "#6d8f75",
};

export const getCategoryColor = (activity: Activity) => {
  const category = activity.categories.find((item) => categoryColors[item]);
  return category ? categoryColors[category] : "#196b85";
};
