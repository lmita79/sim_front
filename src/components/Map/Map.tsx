import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useApp } from '../../context/AppContext';
import { fetchGlobalScore } from '../../services/api';
import { ScorePanel } from '../ScorePanel/ScorePanel';
import type { LayerGroup } from '../../types';
import './Map.css';
import type { FeatureCollection, Point } from 'geojson';

const INITIAL_CENTER: [number, number] = [6.0839, 50.7753];
const INITIAL_ZOOM = 13;

const GROUP_COLORS: Record<LayerGroup, string> = {
  transit: '#38bdf8',
  health: '#f87171',
  services: '#34d399',
  landuse: '#c084fc',
  education: '#fbbf24',
  green: '#4ade80',
  other: '#94a3b8',
};

function makeCircle(lng: number, lat: number, radiusMeters: number, points = 64) {
  const coords: [number, number][] = [];
  const distX = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));
  const distY = radiusMeters / 110540;

  for (let i = 0; i < points; i++) {
    const a = (i / points) * 2 * Math.PI;
    coords.push([lng + distX * Math.cos(a), lat + distY * Math.sin(a)]);
  }

  coords.push(coords[0]);

  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [coords] },
    properties: {},
  };
}

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const analysisMarkerRef = useRef<maplibregl.Marker | null>(null);
  const analysisLngLatRef = useRef<[number, number] | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    filteredPlaces,
    bufferRings,
    settlementType,
    setAnalysisPoint,
    setScoreData,
    setIsLoadingScore,
  } = useApp();

  const [showPanel, setShowPanel] = useState(false);

  // ================= MAP INIT =================
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: 'raster',
            tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [{ id: 'carto-layer', type: 'raster', source: 'carto' }],
      },
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });

    m.addControl(new maplibregl.NavigationControl(), 'top-right');

    // click mapa (análisis)
    m.on('click', async e => {
      const { lng, lat } = e.lngLat;
      analysisLngLatRef.current = [lng, lat];

      if (analysisMarkerRef.current) analysisMarkerRef.current.remove();

      const el = document.createElement('div');
      el.className = 'analysis-pin';

      analysisMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(m);

      setAnalysisPoint({ latitude: lat, longitude: lng, radius: 1000 });
      setIsLoadingScore(true);
      setShowPanel(true);

      updateBufferCircles(m, lng, lat);

      try {
        const score = await fetchGlobalScore(lat, lng, 1000, settlementType);
        setScoreData(score);
      } catch {
        setScoreData(null);
      } finally {
        setIsLoadingScore(false);
      }
    });

    mapRef.current = m;

    return () => {
      m.remove();
      mapRef.current = null;
    };
  }, []);

  // ================= PLACES (LAYER PRO) =================
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    const loadPlaces = () => {
      const OFFSET_LAT = 50.7753 - 49.1244;
      const OFFSET_LNG = 6.0839 - 8.4063;
      const data: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: filteredPlaces.map(p => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            // coordinates: [p.longitude, p.latitude],

            coordinates: [
              p.longitude + OFFSET_LNG,
              p.latitude + OFFSET_LAT
            ],
          },
          properties: {
            id: p.id,
            group: p.layer_group,
          },
        })),
      };

      if (m.getSource('places')) {
        (m.getSource('places') as any).setData(data);
        return;
      }

      m.addSource('places', {
        type: 'geojson',
        data,
      });

      // 🔥 GLOW (NEON)
      m.addLayer({
        id: 'places-glow',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': 12,
          'circle-color': [
            'match',
            ['get', 'group'],
            ...Object.entries(GROUP_COLORS).flat(),
            '#94a3b8',
          ],
          'circle-opacity': 0.2,
          'circle-blur': 0.8,
        },
      } as any);

      // 🔥 BORDE BLANCO
      m.addLayer({
        id: 'places-border',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': 7,
          'circle-color': '#ffffff',
        },
      });

      // 🔥 PUNTO PRINCIPAL
      m.addLayer({
        id: 'places-layer',
        type: 'circle',
        source: 'places',
        paint: {
          'circle-radius': 4.5,
          'circle-color': [
            'match',
            ['get', 'group'],
            ...Object.entries(GROUP_COLORS).flat(),
            '#94a3b8',
          ],
        },
      } as any);

      // 🔥 SELECCIÓN (halo blanco)
      m.addLayer({
        id: 'places-selected-outer',
        type: 'circle',
        source: 'places',
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-radius': 14,
          'circle-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      });

      // 🔥 SELECCIÓN (color interno)
      m.addLayer({
        id: 'places-selected-inner',
        type: 'circle',
        source: 'places',
        filter: ['==', ['get', 'id'], ''],
        paint: {
          'circle-radius': 7,
          'circle-color': [
            'match',
            ['get', 'group'],
            ...Object.entries(GROUP_COLORS).flat(),
            '#94a3b8',
          ],
        },
      } as any);

      // CLICK
      m.on('click', 'places-layer', (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const id = feature.properties?.id;
        setSelectedId(id);
      });

      // CURSOR
      m.on('mouseenter', 'places-layer', () => {
        m.getCanvas().style.cursor = 'pointer';
      });

      m.on('mouseleave', 'places-layer', () => {
        m.getCanvas().style.cursor = '';
      });
    };

    if (!m.isStyleLoaded()) {
      m.once('load', loadPlaces);
    } else {
      loadPlaces();
    }

  }, [filteredPlaces]);

  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;

    if (!selectedId) return;

    if (!m.getLayer('places-selected-inner')) return;

    m.setFilter('places-selected-inner', ['==', ['get', 'id'], selectedId]);
    m.setFilter('places-selected-outer', ['==', ['get', 'id'], selectedId]);

  }, [selectedId]);

  // ================= BUFFERS =================
  const updateBufferCircles = (m: maplibregl.Map, lng: number, lat: number) => {
    bufferRings.forEach(ring => {
      const id = `buf-src-${ring.radius}`;

      if (m.getSource(id)) {
        if (m.getLayer(`buf-fill-${ring.radius}`)) m.removeLayer(`buf-fill-${ring.radius}`);
        if (m.getLayer(`buf-line-${ring.radius}`)) m.removeLayer(`buf-line-${ring.radius}`);
        m.removeSource(id);
      }

      if (!ring.enabled) return;

      m.addSource(id, {
        type: 'geojson',
        data: makeCircle(lng, lat, ring.radius),
      });

      m.addLayer({
        id: `buf-fill-${ring.radius}`,
        type: 'fill',
        source: id,
        paint: {
          'fill-color': ring.color,
          'fill-opacity': ring.opacity,
        },
      });

      m.addLayer({
        id: `buf-line-${ring.radius}`,
        type: 'line',
        source: id,
        paint: {
          'line-color': ring.color,
          'line-width': 1.5,
          'line-opacity': 0.7,
        },
      });
    });
  };

  useEffect(() => {
    const m = mapRef.current;
    if (!m || !analysisLngLatRef.current) return;

    updateBufferCircles(
      m,
      analysisLngLatRef.current[0],
      analysisLngLatRef.current[1]
    );

  }, [bufferRings]);

  const handleClose = () => {
    setShowPanel(false);
    setScoreData(null);
    setAnalysisPoint(null);
    analysisLngLatRef.current = null;

    if (analysisMarkerRef.current) {
      analysisMarkerRef.current.remove();
      analysisMarkerRef.current = null;
    }
  };

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" />
      {showPanel && <ScorePanel onClose={handleClose} />}
    </div>
  );
}