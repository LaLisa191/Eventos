import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import EventImage from '../components/EventImage';
import RequireAuth from '../components/RequireAuth';
import SeatsBar from '../components/SeatsBar';
import StateBox from '../components/StateBox';
import usePageTitle from '../hooks/usePageTitle';
import { formatDateTime, modalityLabel } from '../utils/format';

function MyEventsContent() {
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState(null);
  const [liveEvents, setLiveEvents] = useState(new Map());
  const [error, setError] = useState('');
  const [action, setAction] = useState(null);

  const load = useCallback(async () => {
    try {
      const regs = await api.myRegistrations(token);
      // Cupos reales y actuales: si esta consulta falla, se usan los datos de la inscripción
      const events = await api.events().catch(() => []);
      setLiveEvents(new Map(events.map(ev => [String(ev._id), ev])));
      setRegistrations(regs.filter(r => r.eventId));   // descarta inscripciones cuyo evento ya no existe
      setError('');
    } catch (err) {
      if (err.status !== 401) setError(err.message || 'Ocurrió un error al cargar tus eventos.');
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const cancelled = (registrations ?? []).filter(r => r.status === 'cancelled');

  const withReload = (run) => async () => { await run(); await load(); };

  const askCancel = (r) => setAction({
    title: '¿Cancelar registro?',
    text: `Vas a cancelar tu inscripción a "${r.eventId.name}". Esta acción no se puede deshacer.`,
    confirmLabel: 'Cancelar registro',
    successTitle: 'Registro cancelado correctamente',
    successText: 'Tu inscripción ya aparece como cancelada.',
    run: withReload(() => api.cancelRegistration(token, r.eventId._id, r._id))
  });

  const askRemove = (r) => setAction({
    title: '¿Eliminar de tu lista?',
    text: `"${r.eventId.name}" dejará de aparecer en Mis eventos. Esta acción no se puede deshacer.`,
    confirmLabel: 'Eliminar',
    successTitle: 'Eliminado correctamente',
    successText: 'El evento ya no aparece en tu lista.',
    run: withReload(() => api.deleteRegistration(token, r.eventId._id, r._id))
  });

  const askClear = () => setAction({
    title: '¿Limpiar cancelados?',
    text: `Se eliminarán ${cancelled.length} ${cancelled.length === 1 ? 'inscripción cancelada' : 'inscripciones canceladas'} de tu lista. Esta acción no se puede deshacer.`,
    confirmLabel: 'Limpiar',
    successTitle: 'Lista limpia',
    successText: 'Se eliminaron tus inscripciones canceladas.',
    run: withReload(() => api.clearCancelled(token))
  });

  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Mis eventos</h2>
          <p className="section-sub" style={{ marginBottom: 0 }}>Los eventos a los que te has inscrito.</p>
        </div>
        {cancelled.length > 0 && (
          <button className="btn-secondary" onClick={askClear}>Limpiar cancelados ({cancelled.length})</button>
        )}
      </div>

      <div className="events-grid">
        {error && <StateBox>{error}</StateBox>}
        {!error && registrations === null && <div className="empty-state">Cargando tus eventos...</div>}
        {registrations?.length === 0 && (
          <div className="empty-state">
            Aún no te has registrado a ningún evento.
            <Link to="/#eventos" className="btn-secondary" style={{ marginTop: 14, display: 'inline-flex' }}>Ver eventos disponibles</Link>
          </div>
        )}
        {registrations?.map(r => {
          const ev = liveEvents.get(String(r.eventId._id)) ?? r.eventId;
          const showSeats = Number(ev.maxCapacity) > 0 && Number.isFinite(Number(ev.availableSpots));
          const isCancelled = r.status === 'cancelled';
          return (
            <div className="event-card" key={r._id}>
              <EventImage event={r.eventId} />
              <div className="evento-titulo-fila">
                <h3>{r.eventId.name}</h3>
                <span className={`estado-inscripcion${isCancelled ? ' cancelado' : ''}`}>{isCancelled ? 'Cancelado' : 'Confirmado'}</span>
              </div>
              <div className="meta">{formatDateTime(r.eventId.date)} · {r.eventId.location} · {modalityLabel(r.eventId.modality)}</div>
              {showSeats && <SeatsBar event={ev} />}
              {!isCancelled && <button className="btn-primary btn-cancelar" onClick={() => askCancel(r)}>Cancelar registro</button>}
              {isCancelled && <button className="btn-quitar" onClick={() => askRemove(r)}>Eliminar de mi lista</button>}
            </div>
          );
        })}
      </div>

      {action && <ConfirmDialog action={action} onClose={() => setAction(null)} />}
    </main>
  );
}

export default function MyEvents() {
  usePageTitle('Mis eventos');
  return <RequireAuth><MyEventsContent /></RequireAuth>;
}
