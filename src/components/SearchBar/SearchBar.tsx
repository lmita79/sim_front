import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import './SearchBar.css';

export function SearchBar() {
  const { places, setSearchQuery } = useApp();
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = value.length >= 2
    ? places.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        p.tag_value.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleChange = (v: string) => {
    setValue(v);
    setSearchQuery(v);
    setOpen(v.length >= 2);
  };

  const handleSelect = (name: string) => {
    setValue(name);
    setSearchQuery(name);
    setOpen(false);
  };

  const handleClear = () => {
    setValue('');
    setSearchQuery('');
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="searchbar" ref={ref}>
      <div className="searchbar__input-wrap">
        <Search size={15} className="searchbar__icon" />
        <input
          className="searchbar__input"
          type="text"
          placeholder={t.searchPlaceholder}
          value={value}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => value.length >= 2 && setOpen(true)}
        />
        {value && (
          <button className="searchbar__clear" onClick={handleClear} aria-label="Clear">
            <X size={13} />
          </button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="searchbar__dropdown">
          {suggestions.map(p => (
            <li key={p.id} className="searchbar__item" onMouseDown={() => handleSelect(p.name)}>
              <span className="searchbar__item-name">{p.name}</span>
              <span className="searchbar__item-tag">{p.tag_value.replace(/_/g, ' ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
