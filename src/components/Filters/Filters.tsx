import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { filterCategories } from '../../data/mockPlaces';
import './Filters.css';

export function Filters() {
  const { filters, toggleFilter, clearFilters } = useApp();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setExpanded(prev => {
    const s = new Set(prev);
    if (s.has(id)) s.delete(id); else s.add(id);
    return s;
  });

  return (
    <div className="filters">
      <div className="filters__top">
        <span className="filters__count">{filterCategories.length} categories</span>
        <button onClick={clearFilters} className="filters__reset">{t.clearFilters}</button>
      </div>
      <div className="filters__list">
        {filterCategories.map(cat => {
          const f = filters[cat.id];
          const isExpanded = expanded.has(cat.id);
          const allOn = f?.enabled && f.subcategories.size === cat.subcategories.length;
          const someOn = f?.enabled && f.subcategories.size > 0 && f.subcategories.size < cat.subcategories.length;

          return (
            <div key={cat.id} className="fcat">
              <div className="fcat__row">
                <button className="fcat__expand" onClick={() => toggle(cat.id)}>
                  {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
                <label className="fcat__label">
                  <input
                    type="checkbox"
                    checked={!!allOn}
                    ref={el => { if (el) el.indeterminate = !!someOn; }}
                    onChange={() => toggleFilter(cat.id)}
                    className="fcat__cb"
                  />
                  <span className="fcat__dot" style={{ background: cat.color }} />
                  <span className="fcat__name">{t.placeTypes[cat.id]}</span>
                  <span className="fcat__num">{f?.subcategories.size || 0}/{cat.subcategories.length}</span>
                </label>
              </div>
              {isExpanded && (
                <div className="fcat__subs">
                  {cat.subcategories.map(sub => (
                    <label key={sub} className="fsub__label">
                      <input
                        type="checkbox"
                        checked={f?.subcategories.has(sub) || false}
                        onChange={() => toggleFilter(cat.id, sub)}
                        className="fsub__cb"
                      />
                      <span className="fsub__name">{sub.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
