import { useState } from 'react';
import { X, ChevronDown, MapPin, AlertTriangle, CheckCircle, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './ScorePanel.css';

interface Indicator {
  id: string;
  label: string;
  value: number;       // 0-100 para la barra
  rawValue: string;    // valor legible: "747m", "5 paradas", etc.
  score: number;       // score ponderado dentro de la variable
}

interface Variable {
  id: string;
  label: string;
  weight: number;
  score: number;
  maxScore: number;
  avg_pct?: number;
  classification: 'strong' | 'moderate' | 'gap';
  classificationLabel?: string;
  indicators: Indicator[];
}

interface ScorePanelProps {
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────

const CLASS_CONFIG = {
  strong: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.25)',
    label: 'STRONG',
    icon: CheckCircle,
  },
  moderate: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    label: 'MODERATE',
    icon: Minus,
  },
  gap: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.22)',
    label: 'CAPACITY GAP',
    icon: AlertTriangle,
  },
};

function getArcPath(score: number, max: number = 100) {
  const pct = Math.min(score / max, 1);
  const angle = pct * 240 - 120; // arco de 240°, empieza en -120°
  const toRad = (d: number) => (d * Math.PI) / 180;
  const cx = 60, cy = 60, r = 48;

  const startAngle = toRad(-210);
  const endAngle = toRad(-210 + pct * 240);

  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);

  const largeArc = pct * 240 > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

function getScoreColor(score: number, max: number = 100) {
  const pct = score / max;
  if (pct >= 0.70) return '#22c55e';
  if (pct >= 0.40) return '#f59e0b';
  return '#ef4444';
}

// ─── Subcomponents ────────────────────────────────────────

function GaugeChart({ score, max = 100 }: { score: number; max: number }) {
  const color = getScoreColor(score, max);
  const trackPath = getArcPath(max, max);
  const scorePath = getArcPath(score, max);

  // pct label
  const label = score >= 70 ? 'Strong capacity' : score >= 40 ? 'Moderate capacity' : 'Capacity gap';

  return (
    <div className="sp-gauge">
      <svg viewBox="0 0 120 100" className="sp-gauge__svg">
        {/* Track */}
        <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
        {/* Score arc */}
        <path d={scorePath} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      <div className="sp-gauge__label">
        <span className="sp-gauge__score">{score}</span>
        <span className="sp-gauge__max">/100</span>
      </div>
      <div className="sp-gauge__caption" style={{ color }}>
        {label}
      </div>
    </div>
  );
}

function ClassBadge({ classification }: { classification: 'strong' | 'moderate' | 'gap' }) {
  const cfg = CLASS_CONFIG[classification];
  const Icon = cfg.icon;
  return (
    <span className="sp-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function ColorDots({ variables }: { variables: Variable[] }) {
  return (
    <div className="sp-dots">
      {variables.map(v => (
        <span
          key={v.id}
          className="sp-dot"
          title={v.label}
          style={{ background: CLASS_CONFIG[v.classification]?.color || '#94a3b8' }}
        />
      ))}
    </div>
  );
}

function IndicatorRow({ ind }: { ind: Indicator }) {
  const barColor = ind.value >= 70 ? '#22c55e' : ind.value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="sp-ind">
      <div className="sp-ind__header">
        <span className="sp-ind__id">{ind.id}</span>
        <span className="sp-ind__label">{ind.label}</span>
        <span className="sp-ind__raw" style={{ color: barColor }}>{ind.rawValue}</span>
        <span className="sp-ind__val">{ind.value}</span>
      </div>
      <div className="sp-ind__bar-track">
        <div
          className="sp-ind__bar-fill"
          style={{ width: `${ind.value}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

function VariableRow({ variable }: { variable: Variable }) {
  const [open, setOpen] = useState(false);
  const cfg = CLASS_CONFIG[variable.classification];
  const barPct = (variable.score / variable.maxScore) * 100;

  return (
    <div className="sp-var" style={{ borderColor: open ? cfg.border : 'transparent' }}>
      <button className="sp-var__header" onClick={() => setOpen(o => !o)}>
        <span className="sp-var__icon" style={{ color: cfg.color }}>
          <cfg.icon size={13} />
        </span>
        <span className="sp-var__label">{variable.label}</span>
        <span className="sp-var__score">
          <strong style={{ color: cfg.color }}>{variable.score.toFixed(1)}</strong>
          <span className="sp-var__max">/{variable.maxScore}</span>
        </span>
        <ClassBadge classification={variable.classification} />
        <ChevronDown
          size={13}
          className={`sp-var__chevron ${open ? 'sp-var__chevron--open' : ''}`}
        />
      </button>

      {/* Barra de progreso de la variable */}
      <div className="sp-var__bar-track">
        <div
          className="sp-var__bar-fill"
          style={{
            width: `${barPct}%`,
            background: cfg.color,
            boxShadow: `0 0 8px ${cfg.color}60`,
          }}
        />
      </div>

      {/* Indicadores expandibles */}
      {open && (
        <div className="sp-var__body">
          {variable.classificationLabel && (
            <p className="sp-var__class-label" style={{ color: cfg.color }}>
              {variable.classificationLabel}
            </p>
          )}
          <div className="sp-var__indicators">
            {variable.indicators && variable.indicators.length > 0
              ? variable.indicators.map(ind => (
                  <IndicatorRow key={ind.id} ind={ind} />
                ))
              : (
                <p className="sp-var__no-data">Sin datos de indicadores</p>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="sp-loading">
      <div className="sp-loading__gauge" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="sp-loading__row" style={{ opacity: 1 - i * 0.15 }} />
      ))}
      <p className="sp-loading__text">Analizando ubicación…</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────

export function ScorePanel({ onClose }: ScorePanelProps) {
  const { scoreData, isLoadingScore, analysisPoint } = useApp();

  const variables: Variable[] = (scoreData as any)?.variables || [];
  const globalScore: number = (scoreData as any)?.global_score ?? scoreData?.global_score ?? 0;

  return (
    <div className="score-panel">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-header__left">
          <MapPin size={14} className="sp-header__pin" />
          <div>
            <h2 className="sp-header__title">Site Analysis</h2>
            {analysisPoint && (
              <p className="sp-header__coords">
                {analysisPoint.latitude.toFixed(4)}, {analysisPoint.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        <button className="sp-header__close" onClick={onClose} aria-label="Close">
          <X size={15} />
        </button>
      </div>

      <div className="sp-body">
        {isLoadingScore ? (
          <LoadingSkeleton />
        ) : !scoreData ? (
          <div className="sp-empty">
            <AlertTriangle size={24} />
            <p>No se pudo calcular el puntaje.</p>
          </div>
        ) : (
          <>
            {/* Gauge + label */}
            <div className="sp-summary">
              <GaugeChart score={globalScore} max={100} />
              <div className="sp-summary__right">
                <p className="sp-summary__integration">INTEGRATION SCORE</p>
                {variables.length > 0 && (
                  <ColorDots variables={variables} />
                )}
              </div>
            </div>

            {/* Variables */}
            <div className="sp-variables">
              {variables.length > 0 ? (
                variables.map(v => (
                  <VariableRow key={v.id} variable={v} />
                ))
              ) : (
                <p className="sp-empty-vars">Sin datos de variables.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}