import type { Place, ScoreData, SettlementType } from '../types';
import { mockPlaces, generateMockScore } from '../data/mockPlaces';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = true;

export async function fetchPlaces(): Promise<Place[]> {
  if (USE_MOCK) return Promise.resolve(mockPlaces);
  const response = await fetch(`${API_BASE_URL}/api/places`);
  if (!response.ok) throw new Error('Failed to fetch places');
  return response.json();
}

export async function fetchGlobalScore(
  lat: number,
  lng: number,
  _radius: number,
  settlementType: SettlementType = 'general'
): Promise<ScoreData> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 700));
    return generateMockScore(lat, lng, settlementType);
  }
  const response = await fetch(
    `${API_BASE_URL}/api/global_score?lat=${lat}&lng=${lng}&radius=${_radius}&type=${settlementType}`
  );
  if (!response.ok) throw new Error('Failed to fetch score');
  return response.json();
}
