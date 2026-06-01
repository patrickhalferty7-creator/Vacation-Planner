export type DistanceBand =
  | "In Pornic"
  | "Under 30 min"
  | "30–60 min"
  | "1–2 hrs"
  | "2–3 hrs";

export type EffortLevel = "Easy" | "Moderate" | "Big Day";

export type TripType =
  | "Local outing"
  | "Half-day trip"
  | "Full-day trip"
  | "Big day trip";

export type Activity = {
  id: string;
  name: string;
  rank?: number;
  categories: string[];
  location: string;
  latitude: number;
  longitude: number;
  driveTimeMinutes: number;
  driveTimeLabel: string;
  distanceKm?: number;
  distanceBand: DistanceBand;
  tripType: TripType;
  worthTheDriveNote?: string;
  pairsWellWith?: string[];
  mustDoScore: number;
  teenAppealScore: number;
  allAgesScore: number;
  effortLevel: EffortLevel;
  rainyDayFriendly: boolean;
  estimatedDuration: string;
  bestTimeOfDay: string;
  bestFor: string[];
  shortDescription: string;
  whyWeThinkYoullLikeIt: string;
  watchOuts: string[];
  googleMapsQuery: string;
  imageUrl?: string;
};

export type ItineraryDay = {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  driveIntensity: string;
  notes: string;
};

export type Itinerary = {
  id: string;
  title: string;
  description: string;
  days: ItineraryDay[];
};

export type Filters = {
  search: string;
  categories: string[];
  distanceBands: DistanceBand[];
  minMustDo: number;
  minTeenAppeal: number;
  rainyDayOnly: boolean;
  effortLevels: EffortLevel[];
  wineCider: boolean;
  waterActivities: boolean;
  historyCulture: boolean;
  outdoors: boolean;
};

export type SortOption =
  | "recommended"
  | "closest"
  | "furthest"
  | "valueForDrive"
  | "highestWithinHour"
  | "teenWithinHour"
  | "teen"
  | "allAges"
  | "rainy";
