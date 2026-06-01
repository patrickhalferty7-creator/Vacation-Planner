import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import type { Activity } from "../types";
import {
  categoryColors,
  formatDriveBadge,
  getCategoryColor,
  pornicHomeBase,
} from "../utils/planner";
import { allCategories } from "../data/activities";
import { Badge, SectionHeader, cx } from "./ui";

type ActivityMapProps = {
  activities: Activity[];
  onOpenActivity: (activity: Activity) => void;
};

const driveRings = [
  { label: "30 min", radius: 35000, color: "#6d8f75" },
  { label: "1 hr", radius: 75000, color: "#196b85" },
  { label: "2 hrs", radius: 150000, color: "#d9785f" },
  { label: "3 hrs", radius: 225000, color: "#9a4c65" },
];

export function ActivityMap({ activities, onOpenActivity }: ActivityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const ringLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showRings, setShowRings] = useState(true);

  const visibleActivities = useMemo(() => {
    if (!selectedCategories.length) return activities;
    return activities.filter((activity) => activity.categories.some((category) => selectedCategories.includes(category)));
  }, [activities, selectedCategories]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [pornicHomeBase.latitude, pornicHomeBase.longitude],
      zoom: 9,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    L.marker([pornicHomeBase.latitude, pornicHomeBase.longitude], {
      icon: L.divIcon({
        className: "",
        html: '<div class="home-marker">P</div>',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      }),
    })
      .addTo(map)
      .bindPopup("<strong>Pornic home base</strong><br/>All drive times start here.");

    markerLayerRef.current = L.layerGroup().addTo(map);
    ringLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();

    const bounds = L.latLngBounds([[pornicHomeBase.latitude, pornicHomeBase.longitude]]);

    visibleActivities.forEach((activity) => {
      const color = getCategoryColor(activity);
      const marker = L.marker([activity.latitude, activity.longitude], {
        icon: L.divIcon({
          className: "",
          html: `<div class="activity-marker" style="background:${color}">${activity.driveTimeMinutes || "0"}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
      });

      marker.bindPopup(`
        <div>
          <strong>${activity.name}</strong>
          <div style="margin-top:6px;font-weight:800;color:#196b85;">${formatDriveBadge(activity)}</div>
          <div style="margin-top:4px;">Must-do: ${activity.mustDoScore}/5</div>
          <p style="margin:8px 0 0;line-height:1.45;">${activity.shortDescription}</p>
          <button class="popup-detail-button" data-activity-id="${activity.id}" type="button">View full details</button>
        </div>
      `);

      marker.on("popupopen", (event) => {
        const popupElement = event.popup.getElement();
        const button = popupElement?.querySelector<HTMLButtonElement>(".popup-detail-button");
        button?.addEventListener("click", () => onOpenActivity(activity));
      });

      marker.addTo(markerLayer);
      bounds.extend([activity.latitude, activity.longitude]);
    });

    if (visibleActivities.length) {
      map.fitBounds(bounds.pad(0.12), { maxZoom: 9 });
    }
  }, [visibleActivities, onOpenActivity]);

  useEffect(() => {
    const ringLayer = ringLayerRef.current;
    if (!ringLayer) return;
    ringLayer.clearLayers();
    if (!showRings) return;

    driveRings.forEach((ring) => {
      L.circle([pornicHomeBase.latitude, pornicHomeBase.longitude], {
        radius: ring.radius,
        color: ring.color,
        fillColor: ring.color,
        fillOpacity: 0.03,
        opacity: 0.5,
        weight: 2,
        dashArray: "8 8",
      }).addTo(ringLayer);
    });
  }, [showRings]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  };

  return (
    <section id="map" className="scroll-mt-24 py-12">
      <SectionHeader
        eyebrow="Map-first planning"
        title="Activities around Pornic"
        description="Pornic is the fixed home base. Filtered explorer results appear here too, with drive-time markers and optional rough drive-time rings."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="sand">Map category filter</Badge>
        {allCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => toggleCategory(category)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs font-bold transition",
              selectedCategories.includes(category)
                ? "border-coast-blue bg-coast-blue text-white"
                : "border-coast-blue/15 bg-white text-coast-slate hover:border-coast-blue/40",
            )}
          >
            {category}
          </button>
        ))}
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-full border border-coast-blue/15 bg-white px-3 py-1.5 text-xs font-bold text-coast-slate">
          <input
            type="checkbox"
            checked={showRings}
            onChange={(event) => setShowRings(event.target.checked)}
            className="h-3.5 w-3.5 accent-coast-blue"
          />
          Show drive-time bands
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="overflow-hidden rounded-lg border border-coast-blue/12 bg-white p-2 shadow-soft">
          <div
            ref={containerRef}
            className="h-[520px] md:h-[620px] w-full rounded-lg"
            aria-label="Interactive map of activities near Pornic"
          />
        </div>

        <aside className="rounded-lg border border-coast-blue/12 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-black text-coast-slate">Legend</h3>
          <p className="mt-1 text-sm leading-6 text-coast-slate/65">
            Marker numbers show approximate drive minutes from Pornic. The home marker is Pornic.
          </p>
          <div className="mt-4 space-y-2">
            {Object.entries(categoryColors)
              .slice(0, 14)
              .map(([category, color]) => (
                <div key={category} className="flex items-center gap-2 text-sm font-semibold text-coast-slate/75">
                  <span className="h-3 w-3 rounded-full" style={{ background: color }} />
                  {category}
                </div>
              ))}
          </div>
          <div className="mt-5 border-t border-coast-blue/10 pt-4">
            <h4 className="text-sm font-black uppercase tracking-[0.1em] text-coast-slate/55">Drive-time rings</h4>
            <div className="mt-3 space-y-2">
              {driveRings.map((ring) => (
                <div key={ring.label} className="flex items-center gap-2 text-sm font-semibold text-coast-slate/75">
                  <span className="h-0.5 w-8 border-t-2 border-dashed" style={{ borderColor: ring.color }} />
                  {ring.label} from Pornic
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-md bg-coast-foam p-3 text-sm font-semibold leading-6 text-coast-slate/70">
            Showing {visibleActivities.length} activity markers after explorer and map filters.
          </div>
        </aside>
      </div>
    </section>
  );
}
