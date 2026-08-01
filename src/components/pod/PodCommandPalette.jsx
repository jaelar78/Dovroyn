import { useEffect, useMemo, useState } from 'react';
import { Command, Search } from 'lucide-react';

export default function PodCommandPalette({ open, commands, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setQuery('');
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((item) => `${item.label} ${item.group}`.toLowerCase().includes(needle));
  }, [commands, query]);

  if (!open) return null;

  return (
    <div className="pod-command-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="pod-command panel" role="dialog" aria-modal="true" aria-label="Pod command palette" onMouseDown={(event) => event.stopPropagation()}>
        <label className="pod-command-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search pod commands</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Move around this pod or run an action…" />
          <kbd>Esc</kbd>
        </label>
        <div className="pod-command-list">
          {filtered.map((item) => (
            <button key={`${item.group}-${item.label}`} type="button" onClick={() => { item.action(); onClose(); }}>
              <span><Command size={14} aria-hidden="true" />{item.label}</span>
              <small>{item.group}</small>
            </button>
          ))}
          {!filtered.length && <p className="subtle pod-command-empty">No matching pod action.</p>}
        </div>
      </section>
    </div>
  );
}
