import { useState } from 'react';
import Modal from './Modal';

// Diálogo de confirmación en dos pasos: pide permiso y, si la acción sale bien, muestra el éxito.
// action = { title, text, confirmLabel, successTitle, successText, run: async () => void }
export default function ConfirmDialog({ action, onClose }) {
  const [step, setStep] = useState('confirm');   // 'confirm' | 'done'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function accept() {
    if (step === 'done') return onClose();
    setBusy(true);
    setError('');
    try {
      await action.run();
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const done = step === 'done';
  // Texto del botón principal según el estado del diálogo
  let label = action.confirmLabel;
  if (busy) label = 'Procesando...';
  else if (done) label = 'Aceptar';
  else if (error) label = 'Reintentar';

  return (
    <Modal onClose={onClose} cardClassName="confirm-card" showClose={false} role="alertdialog" aria-modal="true">
      <h3>{done ? action.successTitle : action.title}</h3>
      <p>{done ? action.successText : error || action.text}</p>
      <div className="confirm-actions">
        {!done && <button className="btn-secondary" onClick={onClose}>Volver</button>}
        <button className="btn-primary" onClick={accept} disabled={busy}>{label}</button>
      </div>
    </Modal>
  );
}