import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import usePageTitle from '../hooks/usePageTitle';

export default function QrEvent() {
  usePageTitle('QR del evento');
  const [params] = useSearchParams();
  const id = params.get('id');
  const name = params.get('nombre');
  const [qr, setQr] = useState(null);
  const [error, setError] = useState(id ? '' : 'Falta el parámetro "id" en la URL.');

  useEffect(() => {
    if (!id) return;
    api.eventQr(id).then((d) => setQr(d.qr)).catch((e) => setError(e.message));
  }, [id]);

  return (
    <div className="qr-page">
      <div className="qr-card">
        <h1>{name ? `QR - ${name}` : 'Código de acceso'}</h1>
        <p>Escanea el código para acceder al registro.</p>
        {!qr && !error && <p>Generando tu código QR...</p>}
        {qr && <img src={qr} alt="Código QR del evento" />}
        {error && <div className="state-box error">⚠️ {error}</div>}
      </div>
    </div>
  );
}
