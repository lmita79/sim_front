import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Bus, Heart, Building2, MapPin, Trees, Home, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { VariableResult } from '../../types';
import './ScorePanel.css';

interface Props { onClose: () => void; }

const VAR_ICONS: Record<string, React.ElementType> = {
  accessibility:    Bus,
  services:         Heart,
  urbanIntegration: Building2,
  landUse:          MapPin,
  greenSpace:       Trees,
  housing:          Home,
  education:        GraduationCap,
};

function ScoreArc({ score }: { score: number }) {
  const r = 52;
  const cx = 64;
  const cy = 64;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  const offset = arc - (arc * Math.min(score, 100)) / 100;
  const color = score >= 70 ? 'var(--color-good)' : score >= 40 ? 'var(--color-average)' : 'var(--color-poor)';
  return (
    <svg width="128" height="100" viewBox="0 0 128 108" className="score-arc">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-elevated)" strokeWidth="10"
        strokeDasharray={`${arc} ${circ - arc}`} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${arc - offset} ${circ - (arc - offset)}`} strokeLinecap="round"
        transform={`rotate(135 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 1s ease-out', filter: `drop-shadow(0 0 6px ${color})` }} />
    </svg>
  );
}

function VariableRow({ v, index }: { v: VariableResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pct = (v.score / v.maxScore) * 100;
  const Icon = VAR_ICONS[v.id] || MapPin;
  const clsLabel: Record<string, string> = { strong: 'Strong', moderate: 'Moderate', gap: 'Capacity gap' };

  return (
    <div className="var-row" style={{ animationDelay: `${index * 60}ms` }}>
      <button className="var-row__header" onClick={() => setExpanded(e => !e)}>
        <div className="var-row__icon-wrap"><Icon size={14} /></div>
        <div className="var-row__info">
          <div className="var-row__top">
            <span className="var-row__label">{v.label}</span>
            <span className="var-row__score">{v.score.toFixed(1)}<span className="var-row__max">/{v.maxScore}</span></span>
          </div>
          <div className="var-row__bar-wrap">
            <div className="var-row__bar" style={{ width: `${pct}%`, '--bar-color': pct >= 70 ? 'var(--color-good)' : pct >= 40 ? 'var(--color-average)' : 'var(--color-poor)' } as React.CSSProperties} />
          </div>
        </div>
        <span className={`var-row__cls var-row__cls--${v.classification}`}>{clsLabel[v.classification]}</span>
        <div className="var-row__chevron">{expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</div>
      </button>
      {expanded && (
        <div className="var-row__indicators">
          {v.indicators.map(ind => (
            <div key={ind.id} className="indicator">
              <span className="indicator__id">{ind.id}</span>
              <span className="indicator__label">{ind.label}</span>
              <span className="indicator__raw">{ind.rawValue}</span>
              <div className="indicator__bar-wrap"><div className="indicator__bar" style={{ width: `${ind.value}%` }} /></div>
              <span className="indicator__score">{ind.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ScorePanel({ onClose }: Props) {
  const { scoreData, isLoadingScore, analysisPoint } = useApp();
  const { t } = useTranslation();
  const scoreClass = !scoreData ? '' : scoreData.global_score >= 70 ? 'good' : scoreData.global_score >= 40 ? 'average' : 'poor';
  const scoreLabel = !scoreData ? '' : scoreData.global_score >= 70 ? t.score.good : scoreData.global_score >= 40 ? t.score.average : t.score.poor;

  return (
    <div className="score-panel">
      <div className="score-panel__header">
        <div>
          <h2 className="score-panel__title">{t.score.title}</h2>
          {analysisPoint && (
            <span className="score-panel__coords">{analysisPoint.latitude.toFixed(4)}, {analysisPoint.longitude.toFixed(4)}</span>
          )}
        </div>
        <button className="score-panel__close" onClick={onClose} aria-label="Close"><X size={16} /></button>
      </div>
      {isLoadingScore ? (
        <div className="score-panel__loading">
          <div className="score-panel__spinner" />
          <p>Analyzing site...</p>
        </div>
      ) : scoreData ? (
        <>
          <div className="score-panel__hero">
            <div className="score-arc-wrap">
              <ScoreArc score={scoreData.global_score} />
              <div className="score-arc-value">
                <span className="score-arc-num">{scoreData.global_score.toFixed(1)}</span>
                <span className="score-arc-out">{t.score.outOf}</span>
              </div>
            </div>
            <div className="score-hero-right">
              <span className="score-panel__global-label">{t.score.global}</span>
              <span className={`score-badge score-badge--${scoreClass}`}>{scoreLabel}</span>
              <div className="score-mini-bars">
                {scoreData.variables.map(v => {
                  const pct = (v.score / v.maxScore) * 100;
                  const c = pct >= 70 ? 'var(--color-good)' : pct >= 40 ? 'var(--color-average)' : 'var(--color-poor)';
                  return (
                    <div key={v.id} className="score-mini-bar" title={`${v.label}: ${v.score.toFixed(1)}/${v.maxScore}`}>
                      <div className="score-mini-bar__fill" style={{ height: `${pct}%`, background: c }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="score-panel__variables">
            {scoreData.variables.map((v, i) => <VariableRow key={v.id} v={v} index={i} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}
