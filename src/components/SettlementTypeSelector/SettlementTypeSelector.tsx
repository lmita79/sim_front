import { Users, Baby, ShieldAlert, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import type { SettlementType } from '../../types';
import './SettlementTypeSelector.css';

const TYPES: Array<{ id: SettlementType; icon: React.ElementType; color: string }> = [
  { id: 'general',  icon: Users,       color: '#3b82f6' },
  { id: 'mothers',  icon: Baby,        color: '#f472b6' },
  { id: 'trauma',   icon: ShieldAlert, color: '#fb923c' },
  { id: 'singles',  icon: User,        color: '#34d399' },
];

export function SettlementTypeSelector() {
  const { settlementType, setSettlementType } = useApp();
  const { t } = useTranslation();

  return (
    <div className="settlement-selector">
      {TYPES.map(({ id, icon: Icon, color }) => {
        const active = settlementType === id;
        return (
          <button
            key={id}
            className={`settlement-btn ${active ? 'settlement-btn--active' : ''}`}
            style={{ '--st-color': color } as React.CSSProperties}
            onClick={() => setSettlementType(id)}
          >
            <div className="settlement-btn__icon-wrap">
              <Icon size={16} />
            </div>
            <span className="settlement-btn__label">{t.settlementTypes[id]}</span>
          </button>
        );
      })}
    </div>
  );
}
