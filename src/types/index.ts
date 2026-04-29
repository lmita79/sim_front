export type LayerGroup = 'transit' | 'health' | 'services' | 'landuse' | 'education' | 'green' | 'other';
export type SettlementType = 'general' | 'mothers' | 'trauma' | 'singles';

export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  place_type: PlaceType;
  tag_value: string;
  layer_group: LayerGroup;
}

export type PlaceType =
  | 'amenity'
  | 'leisure'
  | 'public_transport'
  | 'shop'
  | 'railway'
  | 'tourism'
  | 'urban_service'
  | 'industrial'
  | 'vacant_lot';

export interface FilterCategory {
  id: PlaceType;
  label: string;
  color: string;
  subcategories: string[];
}

export interface FilterState {
  [key: string]: {
    enabled: boolean;
    subcategories: Set<string>;
  };
}

export interface LayerVisibility {
  transit: boolean;
  health: boolean;
  services: boolean;
  landuse: boolean;
  education: boolean;
  green: boolean;
  other: boolean;
}

export interface BufferRing {
  radius: number;
  enabled: boolean;
  color: string;
  opacity: number;
}

export interface IndicatorResult {
  id: string;
  label: string;
  value: number;      // 0-100 para la barra
  rawValue: string;   // ej: "747m", "5 paradas", "Presente"
  score: number;      // score ponderado dentro de la variable
}

export interface VariableResult {
  id: string;
  label: string;
  weight: number;
  score: number;
  maxScore: number;
  avg_pct?: number;
  classification: 'strong' | 'moderate' | 'gap';
  classificationLabel?: string;   // ej: "Red de transporte restringida"
  indicators: IndicatorResult[];
}

export interface ScoreData {
  ok?: boolean;
  global_score: number;
  variables: VariableResult[];
  dimensions?: Record<string, number>;
  metrics?: Record<string, number | null>;
}


export interface AnalysisPoint {
  latitude: number;
  longitude: number;
  radius: number;
}

export type Language = 'en' | 'es';

export interface Translations {
  title: string;
  tagline: string;
  subtitle: string;
  searchPlaceholder: string;
  filters: string;
  clearFilters: string;
  analysisRadius: string;
  bufferRings: string;
  meters: string;
  languageSelector: string;
  clickMapInstructions: string;
  layers: string;
  settlementProfile: string;
  score: {
    title: string;
    global: string;
    outOf: string;
    good: string;
    average: string;
    poor: string;
    indicators: string;
    hide: string;
    show: string;
  };
  variables: {
    accessibility: string;
    services: string;
    urbanIntegration: string;
    landUse: string;
    greenSpace: string;
    housing: string;
    education: string;
  };
  layerGroups: {
    transit: string;
    health: string;
    services: string;
    landuse: string;
    education: string;
    green: string;
    other: string;
  };
  settlementTypes: {
    general: string;
    mothers: string;
    trauma: string;
    singles: string;
  };
  placeTypes: {
    amenity: string;
    leisure: string;
    public_transport: string;
    shop: string;
    railway: string;
    tourism: string;
    urban_service: string;
    industrial: string;
    vacant_lot: string;
  };
}
