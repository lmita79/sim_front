import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import './RadiusSlider.css';

export function RadiusSlider() {
  const { bufferRings, toggleBufferRing } = useApp();
  const { t } = useTranslation();

  return (
    <div className="buffer-rings">
      <p className="buffer-rings__hint">{t.bufferRings}</p>
      <div className="buffer-rings__grid">
        {bufferRings.map(ring => (
          <button
            key={ring.radius}
            className={`ring-btn ${ring.enabled ? 'ring-btn--on' : ''}`}
            style={{ '--ring-color': ring.color } as React.CSSProperties}
            onClick={() => toggleBufferRing(ring.radius)}
          >
            <span className="ring-btn__dot" />
            <span className="ring-btn__label">{ring.radius}{t.meters}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
