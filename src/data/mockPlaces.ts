import type { Place, FilterCategory, BufferRing, SettlementType, ScoreData, VariableResult, IndicatorResult } from '../types';

export const mockPlaces: Place[] = [
  { id: '1',  name: 'City Park',         latitude: 49.1244, longitude: 8.4063, place_type: 'leisure',          tag_value: 'park',             layer_group: 'green' },
  { id: '2',  name: 'Main Station',      latitude: 49.1267, longitude: 8.4088, place_type: 'public_transport', tag_value: 'station',          layer_group: 'transit' },
  { id: '3',  name: 'Hospital',          latitude: 49.1223, longitude: 8.4105, place_type: 'amenity',          tag_value: 'hospital',         layer_group: 'health' },
  { id: '4',  name: 'Supermarket',       latitude: 49.1256, longitude: 8.4072, place_type: 'shop',             tag_value: 'supermarket',      layer_group: 'services' },
  { id: '5',  name: 'Bus Stop Central',  latitude: 49.1270, longitude: 8.4095, place_type: 'public_transport', tag_value: 'stop_position',    layer_group: 'transit' },
  { id: '6',  name: 'Sports Centre',     latitude: 49.1210, longitude: 8.4120, place_type: 'leisure',          tag_value: 'sports_centre',    layer_group: 'green' },
  { id: '7',  name: 'Pharmacy',          latitude: 49.1262, longitude: 8.4078, place_type: 'amenity',          tag_value: 'pharmacy',         layer_group: 'health' },
  { id: '8',  name: 'Railway Platform',  latitude: 49.1268, longitude: 8.4092, place_type: 'railway',          tag_value: 'platform',         layer_group: 'transit' },
  { id: '9',  name: 'Convenience Store', latitude: 49.1250, longitude: 8.4068, place_type: 'shop',             tag_value: 'convenience',      layer_group: 'services' },
  { id: '10', name: 'Playground',        latitude: 49.1240, longitude: 8.4065, place_type: 'leisure',          tag_value: 'playground',       layer_group: 'green' },
  { id: '11', name: 'School',            latitude: 49.1230, longitude: 8.4080, place_type: 'amenity',          tag_value: 'school',           layer_group: 'education' },
  { id: '12', name: 'Community Center',  latitude: 49.1258, longitude: 8.4085, place_type: 'amenity',          tag_value: 'community_centre', layer_group: 'services' },
  { id: '13', name: 'Library',           latitude: 49.1265, longitude: 8.4090, place_type: 'amenity',          tag_value: 'library',          layer_group: 'education' },
  { id: '14', name: 'Jobcenter',         latitude: 49.1245, longitude: 8.4075, place_type: 'urban_service',    tag_value: 'driving_school',   layer_group: 'services' },
  { id: '15', name: 'University',        latitude: 49.1260, longitude: 8.4082, place_type: 'amenity',          tag_value: 'university',       layer_group: 'education' },
  { id: '16', name: 'Marketplace',       latitude: 49.1255, longitude: 8.4070, place_type: 'shop',             tag_value: 'marketplace',      layer_group: 'services' },
  { id: '17', name: 'Park Area',         latitude: 49.1235, longitude: 8.4060, place_type: 'leisure',          tag_value: 'park',             layer_group: 'green' },
  { id: '18', name: 'Bus Platform',      latitude: 49.1272, longitude: 8.4098, place_type: 'public_transport', tag_value: 'platform',         layer_group: 'transit' },
  { id: '19', name: 'Industrial Zone',   latitude: 49.1200, longitude: 8.4150, place_type: 'industrial',       tag_value: 'industrial',       layer_group: 'landuse' },
  { id: '20', name: 'Vacant Lot',        latitude: 49.1195, longitude: 8.4155, place_type: 'vacant_lot',       tag_value: 'vacant',           layer_group: 'landuse' },
  { id: '21', name: 'Green Space',       latitude: 49.1248, longitude: 8.4055, place_type: 'leisure',          tag_value: 'park',             layer_group: 'green' },
  { id: '22', name: 'Tram Stop',         latitude: 49.1275, longitude: 8.4100, place_type: 'public_transport', tag_value: 'stop_position',    layer_group: 'transit' },
  { id: '23', name: 'Police Station',    latitude: 49.1252, longitude: 8.4077, place_type: 'amenity',          tag_value: 'police',           layer_group: 'services' },
  { id: '24', name: 'Shopping Center',   latitude: 49.1263, longitude: 8.4083, place_type: 'shop',             tag_value: 'mall',             layer_group: 'services' },
  { id: '25', name: 'Forest Area',       latitude: 49.1220, longitude: 8.4070, place_type: 'leisure',          tag_value: 'playground',       layer_group: 'green' },
  { id: '26', name: 'Station Platform A',latitude: 49.1269, longitude: 8.4091, place_type: 'railway',          tag_value: 'platform',         layer_group: 'transit' },
  { id: '27', name: 'Train Station',     latitude: 49.1266, longitude: 8.4089, place_type: 'railway',          tag_value: 'station',          layer_group: 'transit' },
  { id: '28', name: 'Grocery Store',     latitude: 49.1257, longitude: 8.4073, place_type: 'shop',             tag_value: 'supermarket',      layer_group: 'services' },
  { id: '29', name: 'Language Center',   latitude: 49.1261, longitude: 8.4087, place_type: 'urban_service',    tag_value: 'music_school',     layer_group: 'education' },
  { id: '30', name: 'Music School',      latitude: 49.1242, longitude: 8.4066, place_type: 'urban_service',    tag_value: 'music_school',     layer_group: 'education' },
  { id: '31', name: 'Sports Field',      latitude: 49.1215, longitude: 8.4115, place_type: 'leisure',          tag_value: 'sports_centre',    layer_group: 'green' },
  { id: '32', name: 'Medical Center',    latitude: 49.1225, longitude: 8.4108, place_type: 'amenity',          tag_value: 'clinic',           layer_group: 'health' },
  { id: '33', name: 'Transit Hub',       latitude: 49.1271, longitude: 8.4093, place_type: 'public_transport', tag_value: 'station',          layer_group: 'transit' },
  { id: '34', name: 'Office Zone',       latitude: 49.1198, longitude: 8.4152, place_type: 'industrial',       tag_value: 'industrial',       layer_group: 'landuse' },
  { id: '35', name: 'Urban Garden',      latitude: 49.1243, longitude: 8.4062, place_type: 'leisure',          tag_value: 'park',             layer_group: 'green' },
  { id: '36', name: 'Dentist',           latitude: 49.1226, longitude: 8.4109, place_type: 'amenity',          tag_value: 'dentist',          layer_group: 'health' },
  { id: '37', name: 'Fire Station',      latitude: 49.1253, longitude: 8.4069, place_type: 'amenity',          tag_value: 'fire_station',     layer_group: 'services' },
  { id: '38', name: 'Post Office',       latitude: 49.1247, longitude: 8.4081, place_type: 'urban_service',    tag_value: 'prep_school',      layer_group: 'services' },
  { id: '39', name: 'Childcare',         latitude: 49.1228, longitude: 8.4084, place_type: 'amenity',          tag_value: 'school',           layer_group: 'education' },
  { id: '40', name: 'Empty Lot',         latitude: 49.1193, longitude: 8.4158, place_type: 'vacant_lot',       tag_value: 'vacant',           layer_group: 'landuse' },
];

export const filterCategories: FilterCategory[] = [
  { id: 'amenity',          label: 'Amenities',        color: '#3b82f6', subcategories: ['hospital','school','pharmacy','library','clinic','community_centre','police','fire_station','dentist','university'] },
  { id: 'leisure',          label: 'Leisure',          color: '#10b981', subcategories: ['park','playground','sports_centre'] },
  { id: 'public_transport', label: 'Public Transport', color: '#f59e0b', subcategories: ['station','stop_position','platform'] },
  { id: 'shop',             label: 'Commerce',         color: '#84cc16', subcategories: ['supermarket','convenience','marketplace','mall'] },
  { id: 'railway',          label: 'Railway',          color: '#94a3b8', subcategories: ['station','platform'] },
  { id: 'tourism',          label: 'Tourism',          color: '#ec4899', subcategories: ['information','museum','attraction','hotel'] },
  { id: 'urban_service',    label: 'Urban Services',   color: '#c084fc', subcategories: ['driving_school','music_school','prep_school'] },
  { id: 'industrial',       label: 'Industrial',       color: '#dc2626', subcategories: ['industrial'] },
  { id: 'vacant_lot',       label: 'Vacant Lots',      color: '#92400e', subcategories: ['vacant'] },
];

export const layerGroupConfig = [
  { id: 'transit',   color: '#38bdf8', icon: 'bus' },
  { id: 'health',    color: '#f87171', icon: 'heart' },
  { id: 'services',  color: '#34d399', icon: 'building' },
  { id: 'landuse',   color: '#c084fc', icon: 'map' },
  { id: 'education', color: '#fbbf24', icon: 'graduation' },
  { id: 'green',     color: '#4ade80', icon: 'tree' },
  { id: 'other',     color: '#94a3b8', icon: 'more' },
] as const;

export const defaultBufferRings: BufferRing[] = [
  { radius: 500,  enabled: true,  color: '#22d3ee', opacity: 0.12 },
  { radius: 1000, enabled: true,  color: '#3b82f6', opacity: 0.10 },
  { radius: 1500, enabled: false, color: '#f59e0b', opacity: 0.08 },
  { radius: 3000, enabled: false, color: '#ef4444', opacity: 0.06 },
];

const settlementWeights: Record<SettlementType, Record<string, number>> = {
  general:  { accessibility: 0.20, services: 0.20, urbanIntegration: 0.15, landUse: 0.10, greenSpace: 0.10, housing: 0.10, education: 0.15 },
  mothers:  { accessibility: 0.15, services: 0.25, urbanIntegration: 0.10, landUse: 0.10, greenSpace: 0.15, housing: 0.10, education: 0.15 },
  trauma:   { accessibility: 0.10, services: 0.20, urbanIntegration: 0.10, landUse: 0.15, greenSpace: 0.20, housing: 0.15, education: 0.10 },
  singles:  { accessibility: 0.25, services: 0.15, urbanIntegration: 0.20, landUse: 0.10, greenSpace: 0.05, housing: 0.10, education: 0.15 },
};

function getClassification(pct: number): string {
  if (pct >= 0.70) return 'strong';
  if (pct >= 0.40) return 'moderate';
  return 'gap';
}

function r(seed: number, min: number, max: number): number {
  return Math.round(min + Math.abs(Math.sin(seed)) * (max - min));
}

export function generateMockScore(lat: number, lng: number, type: SettlementType): ScoreData {
  const s = Math.abs(Math.sin(lat * 1000 + lng * 500)) * 10000;
  const w = settlementWeights[type];

  const rawVars = [
    {
      id: 'accessibility', weight: w.accessibility, maxScore: w.accessibility * 100,
      indicators: [
        { id: '1.1', label: 'Distance to nearest stop',  value: r(s+1,  0, 100), rawValue: `${r(s+11, 30, 900)}m` },
        { id: '1.2', label: 'Stop density (500m buffer)', value: r(s+2,  0, 100), rawValue: `${r(s+12,  0,   8)} stops` },
        { id: '1.3', label: 'Bus departure frequency',   value: r(s+3,  0, 100), rawValue: `${r(s+13,  5, 120)}/day` },
      ],
    },
    {
      id: 'services', weight: w.services, maxScore: w.services * 100,
      indicators: [
        { id: '2.1', label: 'Healthcare access',         value: r(s+4,  0, 100), rawValue: `${r(s+14, 100, 2000)}m` },
        { id: '2.2', label: 'Food supply access',        value: r(s+5,  0, 100), rawValue: `${r(s+15,  0,    6)} markets` },
        { id: '2.3', label: 'Public admin proximity',    value: r(s+6,  0, 100), rawValue: r(s+16, 0, 1) > 0 ? 'Present' : 'Absent' },
      ],
    },
    {
      id: 'urbanIntegration', weight: w.urbanIntegration, maxScore: w.urbanIntegration * 100,
      indicators: [
        { id: '3.1', label: 'Center–periphery location', value: r(s+7,  30, 100), rawValue: `${r(s+17, 1, 9)}km from center` },
        { id: '3.2', label: 'Road intersection density', value: r(s+8,  30, 100), rawValue: `${r(s+18, 10, 120)}/km²` },
        { id: '3.3', label: 'Urban node proximity',      value: r(s+9,  30, 100), rawValue: `${r(s+19, 200, 2000)}m` },
      ],
    },
    {
      id: 'landUse', weight: w.landUse, maxScore: w.landUse * 100,
      indicators: [
        { id: '4.1', label: 'Dominant land use type',    value: r(s+10, 30, 100), rawValue: r(s+20, 0, 2) === 0 ? 'Residential' : r(s+20, 0, 2) === 1 ? 'Mixed' : 'Green landscape' },
        { id: '4.2', label: 'Land use variety',          value: r(s+11, 30, 100), rawValue: `${r(s+21, 1, 5)} typologies` },
        { id: '4.3', label: 'Legal compatibility',       value: r(s+12, 30, 100), rawValue: r(s+22, 0, 1) > 0 ? 'Compatible' : 'Special zone' },
      ],
    },
    {
      id: 'greenSpace', weight: w.greenSpace, maxScore: w.greenSpace * 100,
      indicators: [
        { id: '5.1', label: 'Distance to nearest park',  value: r(s+13, 0,  100), rawValue: `${r(s+23, 50, 1200)}m` },
        { id: '5.2', label: 'Park area',                 value: r(s+14, 30, 100), rawValue: `${(r(s+24, 1, 30) / 10).toFixed(1)} ha` },
        { id: '5.3', label: 'Park typology',             value: r(s+15, 30, 100), rawValue: r(s+25, 0, 3) === 0 ? 'Urban park' : r(s+25, 0, 3) === 1 ? 'Open green' : 'Forest' },
      ],
    },
    {
      id: 'housing', weight: w.housing, maxScore: w.housing * 100,
      indicators: [
        { id: '6.1', label: 'Housing density',           value: r(s+16, 30, 100), rawValue: `${r(s+26, 20, 120)} units/ha` },
        { id: '6.2', label: 'Service presence (500m)',   value: r(s+17, 30, 100), rawValue: `${r(s+27, 0, 12)} POIs` },
        { id: '6.3', label: 'Saturation risk',           value: r(s+18, 30, 100), rawValue: r(s+28, 0, 1) > 0 ? 'No saturation' : 'Risk detected' },
      ],
    },
    {
      id: 'education', weight: w.education, maxScore: w.education * 100,
      indicators: [
        { id: '7.1', label: 'Proximity to office zones', value: r(s+19, 25,  100), rawValue: `${r(s+29, 300, 5000)}m` },
        { id: '7.2', label: 'Training center access',    value: r(s+20, 0,   100), rawValue: r(s+30, 0, 1) > 0 ? 'Present' : 'Absent' },
        { id: '7.3', label: 'Language / ETI centers',    value: r(s+21, 25,  100), rawValue: `${(r(s+31, 5, 65) / 10).toFixed(1)}km` },
      ],
    },
  ];

  const variableLabels: Record<string, string> = {
    accessibility:    'Accessibility',
    services:         'Essential Services',
    urbanIntegration: 'Urban Integration',
    landUse:          'Land Use Compatibility',
    greenSpace:       'Green Space Access',
    housing:          'Housing & Service Density',
    education:        'Education, Work & Language',
  };

  const variables: VariableResult[] = rawVars.map(v => {
    const avg = v.indicators.reduce((sum, i) => sum + i.value, 0) / v.indicators.length;
    const score = parseFloat((avg / 100 * v.maxScore).toFixed(2));
    const indicators: IndicatorResult[] = v.indicators.map(i => ({
      id:       i.id,
      label:    i.label,
      value:    i.value,
      rawValue: i.rawValue,
      score:    parseFloat((i.value / 100 * v.maxScore / 3).toFixed(2)),
    }));
    return {
      id:             v.id,
      label:          variableLabels[v.id],
      weight:         v.weight,
      score,
      maxScore:       parseFloat((v.maxScore).toFixed(1)),
      indicators,
      classification: getClassification(score / v.maxScore),
    };
  });

  const global_score = parseFloat(variables.reduce((sum, v) => sum + v.score, 0).toFixed(1));

  return { global_score, variables };
}
