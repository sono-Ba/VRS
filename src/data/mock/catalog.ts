/**
 * Mock spatial catalog. Relationally consistent by construction:
 * every building/floor/unit is generated from its parent project, so
 * cityId → districtId → projectId → buildingId → floorId → unitId always resolves.
 *
 * This module is only imported by mock repositories — never by UI components.
 */

import type {
  Building,
  City,
  District,
  Floor,
  Project,
  Unit,
  UnitAvailability,
} from "@/domain";
import { routes } from "@/lib/routes";

/** Slugs equal ids throughout this mock, so a city id is also its URL segment. */
interface CitySeed {
  id: string;
  name: string;
  tagline: string;
  description: string;
  sceneSrc: string;
}

const citySeeds: CitySeed[] = [
  {
    id: "abu-dhabi",
    name: "Abu Dhabi",
    tagline: "A capital of quiet luxury",
    description:
      "Explore Abu Dhabi's most considered residential destinations — from cultural island living to waterfront urbanism.",
    sceneSrc: "/media/city.svg",
  },
  {
    id: "dubai",
    name: "Dubai",
    tagline: "Where the skyline meets the water",
    description:
      "Dubai's residential story runs along the creek and the coast — tidal wetlands, tower districts, and marina promenades within minutes of each other.",
    sceneSrc: "/media/city-dubai.svg",
  },
];

interface DistrictSeed {
  id: string;
  cityId: string;
  name: string;
  tagline: string;
  description: string;
  /** Short two-part label for the marker on the city scene. */
  marker: string;
  /** Marker position on the city scene, as a percentage. */
  plot: { x: number; y: number };
}

const districtSeeds: DistrictSeed[] = [
  {
    id: "saadiyat-island",
    cityId: "abu-dhabi",
    name: "Saadiyat Island",
    tagline: "Where culture meets the sea",
    description:
      "Home to the Louvre Abu Dhabi and pristine beachfront, Saadiyat pairs museum-district calm with resort living.",
    marker: "Culture · Beachfront",
    plot: { x: 62, y: 28 },
  },
  {
    id: "al-reem-island",
    cityId: "abu-dhabi",
    name: "Al Reem Island",
    tagline: "Waterfront urbanism",
    description:
      "A dense, walkable waterfront quarter minutes from the CBD, framed by canals and skyline views.",
    marker: "Urban · Waterfront",
    plot: { x: 44, y: 52 },
  },
  {
    id: "yas-island",
    cityId: "abu-dhabi",
    name: "Yas Island",
    tagline: "Marina life, measured pace",
    description:
      "Marina promenades, golf links and year-round entertainment anchor Yas Island's residential coves.",
    marker: "Leisure · Marina",
    plot: { x: 76, y: 64 },
  },
  {
    id: "dubai-creek-harbour",
    cityId: "dubai",
    name: "Dubai Creek Harbour",
    tagline: "A tidal city, newly drawn",
    description:
      "Built along the Ras Al Khor wetlands, Creek Harbour balances a dense waterfront promenade against a protected flamingo sanctuary and open sky.",
    marker: "Creekside · Wetlands",
    plot: { x: 58, y: 42 },
  },
];

/**
 * City markers are derived from the district seeds rather than written by hand,
 * so a district can never exist without a way to reach it from its city.
 */
export const mockCities: City[] = citySeeds.map((seed) => ({
  id: seed.id,
  slug: seed.id,
  name: seed.name,
  tagline: seed.tagline,
  description: seed.description,
  scene: {
    viewerType: "panzoom",
    src: seed.sceneSrc,
    aspectRatio: 1.6,
    hotspots: districtSeeds
      .filter((district) => district.cityId === seed.id)
      .map((district) => ({
        id: district.id,
        label: district.name,
        sublabel: district.marker,
        x: district.plot.x,
        y: district.plot.y,
        href: routes.district(seed.id, district.id),
      })),
  },
}));

interface ProjectSeed {
  id: string;
  districtId: string;
  name: string;
  developer: string;
  status: Project["status"];
  startingPrice: number;
  handover: string;
  bedroomRange: string;
  lifestyle: string;
  description: string;
  amenities: string[];
  /** Hotspot position on the district scene. */
  plot: { x: number; y: number };
}

const projectSeeds: ProjectSeed[] = [
  {
    id: "mamsha-gardens",
    districtId: "saadiyat-island",
    name: "Mamsha Gardens",
    developer: "Aldar",
    status: "selling",
    startingPrice: 2_400_000,
    handover: "Q4 2027",
    bedroomRange: "1–4 BR",
    lifestyle: "Beachfront editorial living",
    description:
      "Low-rise garden residences a short walk from the Saadiyat cultural district, arranged around shaded courtyards that open to the beach boardwalk.",
    amenities: ["Private beach access", "Infinity pool", "Wellness pavilion", "Concierge", "Residents' library"],
    plot: { x: 34, y: 42 },
  },
  {
    id: "soul-beach-residences",
    districtId: "saadiyat-island",
    name: "Soul Beach Residences",
    developer: "Aldar",
    status: "launch",
    startingPrice: 3_100_000,
    handover: "Q2 2028",
    bedroomRange: "2–5 BR",
    lifestyle: "Resort-calibre coastal calm",
    description:
      "A newly launched enclave of terraced residences stepping down toward a protected stretch of Saadiyat coastline.",
    amenities: ["Beach club", "Lap pool", "Spa & sauna", "Padel courts", "Kids' cove"],
    plot: { x: 64, y: 56 },
  },
  {
    id: "reem-central-park",
    districtId: "al-reem-island",
    name: "Reem Central Park Residences",
    developer: "Q Properties",
    status: "selling",
    startingPrice: 1_150_000,
    handover: "Q1 2027",
    bedroomRange: "Studio–3 BR",
    lifestyle: "Park-side urban living",
    description:
      "Twin towers on the edge of Reem Central Park with direct canal-promenade access and skyline panoramas.",
    amenities: ["Park access", "Sky lounge", "Gym & studio", "Co-working suites", "Retail podium"],
    plot: { x: 48, y: 48 },
  },
  {
    id: "yas-bay-residences",
    districtId: "yas-island",
    name: "Yas Bay Residences",
    developer: "Miral",
    status: "handover",
    startingPrice: 1_650_000,
    handover: "Ready",
    bedroomRange: "1–3 BR",
    lifestyle: "Marina promenade living",
    description:
      "Completed waterfront residences on the Yas Bay promenade, steps from the marina and Etihad Arena.",
    amenities: ["Marina promenade", "Rooftop pool", "Residents' cinema", "Gym", "Valet"],
    plot: { x: 52, y: 60 },
  },
  {
    id: "creek-horizon-residences",
    districtId: "dubai-creek-harbour",
    name: "Creek Horizon Residences",
    developer: "Emaar",
    status: "launch",
    startingPrice: 1_850_000,
    handover: "Q3 2028",
    bedroomRange: "1–4 BR",
    lifestyle: "Creekside tower living",
    description:
      "Twin towers set back from the Creek Harbour promenade, angled so every residence looks either along the water or across the Ras Al Khor sanctuary.",
    amenities: [
      "Creek promenade",
      "Infinity pool deck",
      "Sanctuary viewing terrace",
      "Wellness floor",
      "Residents' lounge",
    ],
    plot: { x: 58, y: 44 },
  },
];

export const mockDistricts: District[] = districtSeeds.map((seed) => ({
  id: seed.id,
  slug: seed.id,
  cityId: seed.cityId,
  name: seed.name,
  tagline: seed.tagline,
  description: seed.description,
  scene: {
    viewerType: "panzoom",
    src: "/media/district.svg",
    aspectRatio: 1.6,
    hotspots: projectSeeds
      .filter((p) => p.districtId === seed.id)
      .map((p) => ({
        id: p.id,
        label: p.name,
        sublabel: p.status === "launch" ? "New launch" : p.status === "handover" ? "Ready" : "Now selling",
        x: p.plot.x,
        y: p.plot.y,
        href: routes.project(seed.cityId, seed.id, p.id),
      })),
  },
}));

const BUILDING_POSITIONS = [
  { x: 36, y: 46 },
  { x: 64, y: 40 },
];

const FLOORS_PER_BUILDING = 6;
const UNITS_PER_FLOOR = 4;

const UNIT_TYPES = [
  { type: "1BR", bedrooms: 1, bathrooms: 1, netArea: 78, balconyArea: 9, basePrice: 1_150_000 },
  { type: "2BR", bedrooms: 2, bathrooms: 2, netArea: 118, balconyArea: 14, basePrice: 2_050_000 },
  { type: "2BR+M", bedrooms: 2, bathrooms: 3, netArea: 134, balconyArea: 16, basePrice: 2_450_000 },
  { type: "3BR", bedrooms: 3, bathrooms: 4, netArea: 172, balconyArea: 22, basePrice: 3_400_000 },
] as const;

const VIEWS: Array<{ en: string; ar: string }> = [
  { en: "Sea View", ar: "إطلالة على البحر" },
  { en: "Park View", ar: "إطلالة على الحديقة" },
  { en: "Skyline View", ar: "إطلالة على الأفق" },
  { en: "Marina View", ar: "إطلالة على المرسى" },
];

/**
 * Deterministic hash so mock inventory is varied but stable across reloads —
 * a fixed repeating cycle would give every project near-identical counts.
 */
function hashUnit(seedId: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seedId.length; i++) {
    hash ^= seedId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

function availabilityFor(unitId: string): UnitAvailability {
  const value = hashUnit(unitId);
  if (value < 0.62) return "available";
  if (value < 0.84) return "reserved";
  return "sold";
}

const UNIT_POSITIONS = [
  { x: 30, y: 34 },
  { x: 70, y: 34 },
  { x: 30, y: 68 },
  { x: 70, y: 68 },
];

export const mockProjects: Project[] = [];
export const mockBuildings: Building[] = [];
export const mockFloors: Floor[] = [];
export const mockUnits: Unit[] = [];

/** Fails loudly at module load if a project seed names a district that does not exist. */
function cityIdForDistrict(districtId: string): string {
  const district = districtSeeds.find((seed) => seed.id === districtId);
  if (!district) {
    throw new Error(`Project seed references unknown district "${districtId}".`);
  }
  return district.cityId;
}

projectSeeds.forEach((seed) => {
  const cityId = cityIdForDistrict(seed.districtId);
  // Units for this project are collected first so their prices can be scaled
  // to meet the project's advertised entry price exactly.
  const projectUnits: Unit[] = [];

  for (let b = 0; b < BUILDING_POSITIONS.length; b++) {
    const buildingLetter = String.fromCharCode(65 + b); // A, B
    const buildingId = `${seed.id}-building-${buildingLetter.toLowerCase()}`;

    const floorHotspots = [];
    for (let f = 1; f <= FLOORS_PER_BUILDING; f++) {
      const floorId = `${buildingId}-floor-${f}`;

      const unitHotspots = [];
      for (let u = 0; u < UNITS_PER_FLOOR; u++) {
        const typeInfo = UNIT_TYPES[(f + u) % UNIT_TYPES.length]!;
        const view = VIEWS[(b + u) % VIEWS.length]!;
        const unitNumber = `${f}0${u + 1}`;
        const unitId = `${buildingId}-unit-${unitNumber}`;
        const availability = availabilityFor(unitId);
        const floorPremium = f * 18_000;

        projectUnits.push({
          id: unitId,
          unitCode: `${seed.id.toUpperCase().slice(0, 3)}-${buildingLetter}-${unitNumber}`,
          unitNumber,
          projectId: seed.id,
          buildingId,
          floorId,
          floorNumber: f,
          unitType: typeInfo.type,
          bedrooms: typeInfo.bedrooms,
          bathrooms: typeInfo.bathrooms,
          netArea: typeInfo.netArea,
          balconyArea: typeInfo.balconyArea,
          grossArea: typeInfo.netArea + typeInfo.balconyArea,
          viewEN: view.en,
          viewAR: view.ar,
          actualPrice: typeInfo.basePrice + floorPremium + b * 40_000,
          availability,
          unitPlanURL: "/media/unitplan.svg",
        });

        const position = UNIT_POSITIONS[u]!;
        unitHotspots.push({
          id: unitId,
          label: `Unit ${unitNumber}`,
          sublabel: `${typeInfo.type} · ${view.en}`,
          x: position.x,
          y: position.y,
          href: routes.unit(cityId, seed.districtId, seed.id, buildingId, floorId, unitId),
        });
      }

      mockFloors.push({
        id: floorId,
        buildingId,
        projectId: seed.id,
        number: f,
        name: `Level ${f}`,
        scene: {
          viewerType: "panzoom",
          src: "/media/floorplate.svg",
          aspectRatio: 1.6,
          hotspots: unitHotspots,
        },
      });

      floorHotspots.push({
        id: floorId,
        label: `Level ${f}`,
        sublabel: `${UNITS_PER_FLOOR} residences`,
        x: 50,
        y: 78 - (f - 1) * 10,
        href: routes.floor(cityId, seed.districtId, seed.id, buildingId, floorId),
      });
    }

    mockBuildings.push({
      id: buildingId,
      projectId: seed.id,
      name: `Building ${buildingLetter}`,
      floorsCount: FLOORS_PER_BUILDING,
      scene: {
        viewerType: "panzoom",
        src: "/media/building.svg",
        aspectRatio: 1.6,
        hotspots: floorHotspots,
      },
    });
  }

  // Scale the raw price ladder so the cheapest residence equals the project's
  // advertised entry price. Without this, "from AED x" would contradict the
  // inventory a client can actually open.
  const rawMinimum = Math.min(
    ...projectUnits.map((unit) => unit.actualPrice ?? Number.POSITIVE_INFINITY)
  );
  const priceFactor = seed.startingPrice / rawMinimum;
  for (const unit of projectUnits) {
    if (unit.actualPrice === undefined) continue;
    unit.actualPrice = Math.round((unit.actualPrice * priceFactor) / 1000) * 1000;
  }
  mockUnits.push(...projectUnits);

  mockProjects.push({
    id: seed.id,
    slug: seed.id,
    cityId,
    districtId: seed.districtId,
    name: seed.name,
    developer: seed.developer,
    status: seed.status,
    startingPrice: seed.startingPrice,
    currency: "AED",
    handover: seed.handover,
    bedroomRange: seed.bedroomRange,
    lifestyle: seed.lifestyle,
    description: seed.description,
    amenities: seed.amenities,
    scene: {
      viewerType: "panzoom",
      src: "/media/siteplan.svg",
      aspectRatio: 1.6,
      hotspots: mockBuildings
        .filter((building) => building.projectId === seed.id)
        .map((building, index) => ({
          id: building.id,
          label: building.name,
          sublabel: `${building.floorsCount} levels`,
          x: BUILDING_POSITIONS[index]!.x,
          y: BUILDING_POSITIONS[index]!.y,
          href: routes.building(cityId, seed.districtId, seed.id, building.id),
        })),
    },
  });
});
