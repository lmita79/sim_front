import { createContext, useContext, useState, ReactNode } from 'react';
import type { Place, FilterState, ScoreData, AnalysisPoint, LayerVisibility, BufferRing, SettlementType } from '../types';
import { mockPlaces, filterCategories, defaultBufferRings } from '../data/mockPlaces';

interface AppContextType {
  places: Place[];
  filteredPlaces: Place[];
  filters: FilterState;
  layerVisibility: LayerVisibility;
  bufferRings: BufferRing[];
  settlementType: SettlementType;
  searchQuery: string;
  radius: number;
  analysisPoint: AnalysisPoint | null;
  scoreData: ScoreData | null;
  isLoadingScore: boolean;
  setPlaces: (places: Place[]) => void;
  setFilters: (filters: FilterState) => void;
  setRadius: (radius: number) => void;
  setAnalysisPoint: (point: AnalysisPoint | null) => void;
  setScoreData: (data: ScoreData | null) => void;
  setIsLoadingScore: (loading: boolean) => void;
  clearFilters: () => void;
  toggleFilter: (categoryId: string, subcategory?: string) => void;
  setLayerVisibility: (group: keyof LayerVisibility, visible: boolean) => void;
  toggleBufferRing: (radius: number) => void;
  setSettlementType: (type: SettlementType) => void;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initializeFilters = (): FilterState => {
  const initialFilters: FilterState = {};
  filterCategories.forEach(category => {
    initialFilters[category.id] = {
      enabled: true,
      subcategories: new Set(category.subcategories)
    };
  });
  return initialFilters;
};

const initLayers = (): LayerVisibility => ({
  transit: true,
  health: true,
  services: true,
  landuse: true,
  education: true,
  green: true,
  other: true, // 👈 ASEGÚRATE
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filters, setFilters] = useState<FilterState>(initializeFilters());
  const [layerVisibility, setLayerVisibilityState] = useState<LayerVisibility>(initLayers());
  const [bufferRings, setBufferRings] = useState<BufferRing[]>(defaultBufferRings);
  const [settlementType, setSettlementType] = useState<SettlementType>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState<number>(1000);
  const [analysisPoint, setAnalysisPoint] = useState<AnalysisPoint | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);

  const filteredPlaces = places.filter(place => {
    if (!layerVisibility[place.layer_group]) return false;
    const categoryFilter = filters[place.place_type];
    if (!categoryFilter || !categoryFilter.enabled) return false;
    if (!categoryFilter.subcategories.has(place.tag_value)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return place.name.toLowerCase().includes(q) || place.tag_value.toLowerCase().includes(q);
    }
    return true;
  });

  const clearFilters = () => setFilters(initializeFilters());

  const toggleFilter = (categoryId: string, subcategory?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      const category = newFilters[categoryId];
      if (!category) return prev;

      if (subcategory) {
        const newSub = new Set(category.subcategories);
        if (newSub.has(subcategory)) newSub.delete(subcategory);
        else newSub.add(subcategory);
        newFilters[categoryId] = { ...category, subcategories: newSub, enabled: newSub.size > 0 };
      } else {
        const catData = filterCategories.find(c => c.id === categoryId);
        if (!catData) return prev;
        const allEnabled = !category.enabled;
        newFilters[categoryId] = {
          enabled: allEnabled,
          subcategories: allEnabled ? new Set(catData.subcategories) : new Set()
        };
      }
      return newFilters;
    });
  };

  const setLayerVisibility = (group: keyof LayerVisibility, visible: boolean) => {
    setLayerVisibilityState(prev => ({ ...prev, [group]: visible }));
  };

  const toggleBufferRing = (radius: number) => {
    setBufferRings(prev => prev.map(r => r.radius === radius ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <AppContext.Provider value={{
      places, filteredPlaces, filters, layerVisibility, bufferRings,
      settlementType, searchQuery, radius, analysisPoint, scoreData, isLoadingScore,
      setFilters, setRadius, setAnalysisPoint, setScoreData, setIsLoadingScore,
      clearFilters, toggleFilter, setLayerVisibility, toggleBufferRing,
      setSettlementType, setSearchQuery, setPlaces,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
