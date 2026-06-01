# Pornic Family Trip Planner

A Vite + React + TypeScript trip-planning app for a multi-generational family group based in Pornic, France. It helps a group of 10 browse, filter, compare, map, shortlist, and plan activities within roughly a 3-hour drive.

## Features

- Top 10 recommendations ranked for teens, adults, grandparents, water lovers, runners/hikers, shoppers, wine/cider fans, history buffs, and art/culture browsers.
- Activity Explorer with search, category filters, drive-time filters, score sliders, effort filters, rainy-day filtering, and interest shortcuts.
- Leaflet map with Pornic home-base marker, category-colored activity markers, popups, legend, and rough drive-time rings.
- Persistent shortlist using `localStorage`, with drive-time mix and category summary.
- Drive Time vs Must-Do comparison matrix.
- Static itinerary blocks for 5-day, 7-day, 10-day, rainy-day, teen-friendly, and grandparents-friendly versions.
- Appendix grouped by fishing, sailing, hiking/running, wine, cider, shopping, history, art/culture, teen activities, nature/beaches, and rainy-day ideas.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Leaflet
- lucide-react icons

## Setup

```bash
cd pornic-trip-planner
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Data Notes

Activity data lives in `src/data/activities.ts` and uses the requested local TypeScript model, including:

- `distanceKm`
- `distanceBand`
- `tripType`
- `worthTheDriveNote`
- `pairsWellWith`

Drive times and distances are planning estimates from Pornic, not live traffic data. Confirm opening hours, booking requirements, tide times, and travel times before committing the group.

## Research Sources Used

- [Puy du Fou official site](https://www.puydufou.com/france/en/no-1-amusement-park-france)
- [Noirmoutier Island tourism: Passage du Gois](https://www.ile-noirmoutier.com/en/gois-passage)
- [Noirmoutier cycling information](https://www.ile-noirmoutier.com/en/noirmoutier-island-bicycle)
- [La Baule-Guérande tourism: Guérande](https://www.labaule-guerande.com/en/discover/the-destination/guerande/)
- [La Baule-Guérande tourism: salt marshes](https://www.labaule-guerande.com/en/discover/salt-marshes/)
- [Les Machines de l'Île official site](https://www.lesmachines-nantes.fr/)
- [Saint-Nazaire tourism: Escal'Atlantic](https://www.saint-nazaire-tourisme.com/les-visites/les-sites-de-visite/escalatlantic/)
- [Pornic tourism: old port](https://www.pornic.com/le-vieux-port-de-pornic.html)
- [Brière Regional Natural Park](https://www.parc-naturel-briere.com/)
- [Château d'Angers official visitor information](https://www.chateau-angers.fr/en/visit/practical-information)
- [Aquarium La Rochelle official site](https://www.aquarium-larochelle.com/)
- [Rochefort-en-Terre tourism](https://www.rochefort-en-terre.fr/decouvrir/office-de-tourisme/)
