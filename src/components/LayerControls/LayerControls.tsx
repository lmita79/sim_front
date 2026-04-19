import { Bus, Heart, Building2, MapPin, GraduationCap, Trees, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { LayerVisibility } from '../../types';
import './LayerControls.css';

const LAYER_CONFIG: Array<{
  key: keyof LayerVisibility;
  color: string;
  icon: React.ElementType;
}> = [
  { key: 'transit',   color: '#38bdf8', icon: Bus },
  { key: 'health',    color: '#f87171', icon: Heart },
  { key: 'services',  color: '#34d399', icon: Building2 },
  { key: 'landuse',   color: '#c084fc', icon: MapPin },
  { key: 'education', color: '#fbbf24', icon: GraduationCap },
  { key: 'green',     color: '#4ade80', icon: Trees },
  { key: 'other',     color: '#94a3b8', icon: MoreHorizontal },
];

export function LayerControls() {
  const { layerVisibility, setLayerVisibility } = useApp();
  const { t } = useTranslation();

  return (
    <div className="layer-controls">
      {LAYER_CONFIG.map(({ key, color, icon: Icon }) => {
        const active = layerVisibility[key];
        return (
          <button
            key={key}
            className={`layer-btn ${active ? 'layer-btn--active' : ''}`}
            style={{ '--layer-color': color } as React.CSSProperties}
            onClick={() => setLayerVisibility(key, !active)}
            title={t.layerGroups[key]}
          >
            <span className="layer-btn__dot" />
            <Icon size={13} className="layer-btn__icon" />
            <span className="layer-btn__label">{t.layerGroups[key]}</span>
            <span className={`layer-btn__toggle ${active ? 'layer-btn__toggle--on' : ''}`} />
          </button>
        );
      })}
    </div>
  );
}
