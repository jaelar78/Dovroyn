import { X } from 'lucide-react';

export default function PodModal({ title, description, open, children, onClose }) {
  if (!open) return null;

  return (
    <div className="pod-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="pod-modal panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pod-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="pod-modal-head">
          <div>
            <h3 id="pod-modal-title">{title}</h3>
            {description && <p className="subtle">{description}</p>}
          </div>
          <button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
