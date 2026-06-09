import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = '', footer }) {
  if (!isOpen) return null;

  const sizeClass = size ? `modal-${size}` : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${sizeClass}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
