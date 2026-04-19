import { useState } from 'react';
import { Globe, ChevronDown, Layers, Users, Filter, Target, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useApp } from '../../context/AppContext';
import { SearchBar } from '../SearchBar/SearchBar';
import { LayerControls } from '../LayerControls/LayerControls';
import { SettlementTypeSelector } from '../SettlementTypeSelector/SettlementTypeSelector';
import { Filters } from '../Filters/Filters';
import { RadiusSlider } from '../RadiusSlider/RadiusSlider';
import './Sidebar.css';

function Section({
  title, icon: Icon, children, defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sb-section">
      <button className="sb-section__toggle" onClick={() => setOpen(o => !o)}>
        <Icon size={14} className="sb-section__icon" />
        <span className="sb-section__title">{title}</span>
        <ChevronDown size={14} className={`sb-section__chevron ${open ? 'sb-section__chevron--open' : ''}`} />
      </button>
      {open && <div className="sb-section__body">{children}</div>}
    </div>
  );
}

export function Sidebar() {
  const { t, language, toggleLanguage } = useTranslation();
  const { filteredPlaces, places } = useApp();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">
            <span>S</span>
          </div>
          <div className="sidebar__logo-text">
            <span className="sidebar__logo-title">{t.title}</span>
            <span className="sidebar__logo-sub">{t.tagline}</span>
          </div>
        </div>
        <button className="sidebar__lang-btn" onClick={toggleLanguage} aria-label={t.languageSelector}>
          <Globe size={13} />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>

      <div className="sidebar__search-area">
        <SearchBar />
      </div>

      <div className="sidebar__stats">
        <div className="sidebar__stat">
          <span className="sidebar__stat-num">{filteredPlaces.length}</span>
          <span className="sidebar__stat-label">visible</span>
        </div>
        <div className="sidebar__stat-divider" />
        <div className="sidebar__stat">
          <span className="sidebar__stat-num">{places.length}</span>
          <span className="sidebar__stat-label">total POIs</span>
        </div>
      </div>

      <p className="sidebar__instructions">{t.clickMapInstructions}</p>

      <div className="sidebar__sections">
        <Section title={t.settlementProfile} icon={Users}>
          <SettlementTypeSelector />
        </Section>

        <Section title={t.layers} icon={Layers}>
          <LayerControls />
        </Section>

        <Section title={t.bufferRings} icon={Target} defaultOpen={false}>
          <RadiusSlider />
        </Section>

        <Section title={t.filters} icon={Filter} defaultOpen={false}>
          <Filters />
        </Section>
      </div>

      <div className="sidebar__footer">
        <span className="sidebar__footer-text">lünarTechStudio · SIM v2</span>
        <button
          className="sidebar__external-btn"
          onClick={() => window.open('https://tu-sim-antiguo.com', '_blank')}
        >
          <ExternalLink size={14} />
          <span>SIM Classic</span>
        </button>
      </div>
    </aside>
  );
}
