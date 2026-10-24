import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import SeatsBar from '../components/SeatsBar';
import StateBox from '../components/StateBox';
import usePageTitle from '../hooks/usePageTitle';
import { downloadIcs } from '../utils/ics';
import { formatDateTime } from '../utils/format';

// Esta ruta también se abre desde el QR y desde el correo de confirmación (/register.html?event=<id>)
export default function Register() {
  usePageTitle('Registro');
  const { user, token } = useAuth();
  const [params] = useSearchParams();
  const eventId = params.get('event');

  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState(eventId ? 'Cargando…' : 'No se indicó ningún evento');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [message, setMessage] = useState(null);   // { type: 'success' | 'error', text }
  const [busy, setBusy] = useState(false);

  // Carga el evento y, si hay sesión, revisa si el usuario ya tiene una inscripción confirmada
  const load = useCallback(async () => {
    if (!eventId) return;
    try {
      const ev = await api.event(eventId);
      setEvent(ev);
      setTitle(ev.name);
      if (token) {
        // Si falla la consulta de inscripciones se asume "no registrado"; el servidor igual rechaza duplicados
        const regs = await api.myRegistrations(token).catch(() => []);
        setAlreadyRegistered(regs.some(r => r.status === 'confirmed' && r.eventId?._id === eventId));
      }
    } catch {
      setTitle('Evento no encontrado');
    }
  }, [eventId, token]);

  useEffect(() => { load(); }, [load]);

  async function confirm() {
    setBusy(true);
    setMessage(null);
    try {
      await api.register(token, eventId);
      setMessage({ type: 'success', text: 'Registro confirmado. Te esperamos en el evento.' });
      await load();   // refresca cupos y marca al usuario como registrado
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  // Se calcula fuera del JSX para evitar ternarios anidados
  let buttonLabel = 'Confirmar mi registro';
  if (busy) buttonLabel = 'Registrando…';
  else if (alreadyRegistered) buttonLabel = 'Registrado';

  // Tras iniciar sesión, el login devuelve al usuario a este mismo registro (parámetro ?next=)
  const loginUrl = '/login?next=' + encodeURIComponent('/register?event=' + eventId);

  // Un usuario ya registrado conserva la vista aunque el evento se haya llenado con su propio cupo
  const noSpots = event && event.availableSpots <= 0 && !alreadyRegistered;

  return (
    <div className="registro-wrap">
      <Link to="/" className="back-link">← Volver a eventos</Link>
      <div className="registro-card">
        <div className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 6 }}>Registro de participante</div>
        <h2>{title}</h2>
        {event && (
          <>
            <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
              {formatDateTime(event.date)} · {event.location}
            </div>
            <div style={{ marginTop: 18 }}><SeatsBar event={event} /></div>

            {!user && (
              <div style={{ marginTop: 22 }}>
                <StateBox>Debes iniciar sesión para registrarte a este evento.</StateBox>
                <Link className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
                  to={loginUrl}>Iniciar sesión</Link>
              </div>
            )}

            {user && !noSpots && (
              <div>
                <label htmlFor="registerEmail">Te registrarás como</label>
                <input id="registerEmail" className="readonly-field" style={{ marginTop: 6 }} value={user.email} readOnly />
                <button className="btn-primary" onClick={confirm} disabled={busy || alreadyRegistered}>
                  {buttonLabel}
                </button>
                {alreadyRegistered && !message && <StateBox type="success">Ya estás registrado en este evento.</StateBox>}
                {alreadyRegistered && (
                  <button className="btn-secondary" style={{ marginTop: 12 }} onClick={() => downloadIcs(event)}>
                    <i className="bi bi-calendar-plus"></i> Agregar al calendario
                  </button>
                )}
              </div>
            )}

            {noSpots && <StateBox>Este evento ya no tiene cupos disponibles.</StateBox>}
            {message && <StateBox type={message.type}>{message.text}</StateBox>}
          </>
        )}
      </div>
    </div>
  );
}