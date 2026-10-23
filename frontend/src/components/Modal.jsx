import { useEffect } from 'react';

// Modal genérico: cierra con clic en el fondo o con Escape y bloquea el scroll de la página
export default function Modal({ onClose, children, cardClassName = 'modal-card', cardStyle, showClose = true, closeLabel = 'Cerrar', ...cardProps }) {
  useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={cardClassName} style={cardStyle} {...cardProps}>
        {showClose && <button className="modal-close" onClick={onClose} aria-label={closeLabel}>×</button>}
        {children}
      </div>
    </div>
  );
}
