import type { Place, ScoreData, SettlementType } from '../types';
import { generateMockScore } from '../data/mockPlaces';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.0.2.58:5001';
const USE_MOCK = false;

// ─── Overpass query ampliada ───────────────────────────────────────────────
// Incluye amenity, shop, leisure, public_transport, railway, landuse, highway
// para que el motor de métricas tenga todos los POIs que necesita.
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';

function buildOverpassQuery(south: number, west: number, north: number, east: number) {
  const bb = `${south},${west},${north},${east}`;
  return `[out:json][timeout:20];
(
  node(${bb})["amenity"];
  node(${bb})["shop"];
  node(${bb})["leisure"];
  node(${bb})["public_transport"];
  node(${bb})["railway"];
  node(${bb})["landuse"];
  node(${bb})["building"~"residential|apartments|house"];
  node(${bb})["office"];
  node(${bb})["highway"~"primary|secondary|residential|crossing"];
);
out;`;
}

// Mapeo de tag principal para cada nodo OSM
function inferPlaceType(tags: Record<string, string>): { place_type: string; tag_value: string } | null {
  const priority = [
    'amenity', 'shop', 'leisure', 'public_transport', 'railway',
    'landuse', 'building', 'office', 'highway',
  ];
  for (const key of priority) {
    if (tags[key]) return { place_type: key, tag_value: tags[key] };
  }
  return null;
}

// ─── fetchPlacesDynamic ────────────────────────────────────────────────────
export async function fetchPlacesDynamic(
  bounds: [[number, number], [number, number]]
): Promise<Place[]> {
  if (USE_MOCK) {
    const { mockPlaces } = await import('../data/mockPlaces');
    return mockPlaces;
  }

  const [south, west] = bounds[0];
  const [north, east] = bounds[1];

  const query = buildOverpassQuery(south, west, north, east);

  const response = await fetch(
    `${OVERPASS_ENDPOINT}?data=${encodeURIComponent(query)}`
  );

  if (!response.ok) throw new Error(`Overpass error: ${response.status}`);

  const data = await response.json();

  const seen = new Set<string>();
  const results: Place[] = [];

  for (const el of data.elements ?? []) {
    if (!el.lat || !el.lon) continue;

    const key = `${el.lat.toFixed(6)},${el.lon.toFixed(6)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const tags = el.tags ?? {};
    const inferred = inferPlaceType(tags);
    if (!inferred) continue;

    results.push({
      id: String(el.id),
      name: tags.name ?? '',
      latitude: el.lat,
      longitude: el.lon,
      place_type: inferred.place_type,
      tag_value: inferred.tag_value,
      layer_group: 'other', // se sobreescribe en Map.tsx con mapToGroup()
    } as Place);
  }

  return results;
}

// ─── fetchGlobalScore ──────────────────────────────────────────────────────
export async function fetchGlobalScore(
  lat: number,
  lng: number,
  radius: number = 1000,
  settlementType: SettlementType = 'general'
): Promise<ScoreData> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return generateMockScore(lat, lng, settlementType);
  }

  const url =
    `${API_BASE_URL}/api/global_score` +
    `?lat=${lat}&lng=${lng}&radius=${radius}&type=${settlementType}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Score API error: ${response.status}`);

  return response.json();
}