import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';
import EventFormModal from '../components/EventFormModal';
import EventImage from '../components/EventImage';
import ReportModal from '../components/ReportModal';
import RequireAuth from '../components/RequireAuth';
import SeatsBar from '../components/SeatsBar';
import StateBox from '../components/StateBox';
import usePageTitle from '../hooks/usePageTitle';
import { formatDateTime, modalityLabel } from '../utils/format';

const STATUS_LABEL = { active: 'Activo', cancelled: 'Cancelado', finished: 'Finalizado' };

function PortalContent() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);        // null | { event: null | evento }
  const [report, setReport] = useState(null);    // null | { eventName, report }
  const [action, setAction] = useState(null);

  const load = useCallback(async () => {
    try {
      const all = await api.events();
      setEvents(all.filter(ev => ev.organizerId === user.id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const askDelete = (ev) => setAction({
    title: '¿Eliminar evento?',
    text: `Vas a eliminar "${ev.name}". Esta acción no se puede deshacer.`,
    confirmLabel: 'Eliminar',
    successTitle: 'Evento eliminado correctamente',
    successText: 'El evento ya no aparece en la lista.',
    run: async () => { await api.deleteEvent(token, ev._id); await load(); }
  });

  async function showReport(ev) {
    try {
      setReport({ eventName: ev.name, report: await api.generateReport(token, ev._id) });
    } catch (err) {
      setError(err.message);
    }
  }

  const saved = () => { setForm(null); load(); };

  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div className="section-header-row">
        <div>
          <h2 className="section-title">Mi portal</h2>
          <p className="section-sub">Los eventos que has creado, con sus inscritos y reportes.</p>
        </div>
        <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); setForm({ event: null }); }}>+ Nuevo evento</a>
      </div>

      <StateBox>{error}</StateBox>
      <div className="events-grid">
        {events?.length === 0 && <div className="empty-state">Todavía no has creado ningún evento.</div>}
        {events?.map(ev => (
          <div className="event-card" key={ev._id}>
            <EventImage event={ev} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <h3>{ev.name}</h3>
              <span className="status-pill">{STATUS_LABEL[ev.status] ?? ev.status}</span>
            </div>
            <div className="meta">{formatDateTime(ev.date)} · {ev.location} · {modalityLabel(ev.modality)}</div>
            <SeatsBar event={ev} />
            <div className="card-actions">
              <button className="btn-secondary" onClick={() => setForm({ event: ev })}>Editar</button>
              <button className="btn-danger" onClick={() => askDelete(ev)}>Eliminar</button>
              <button className="btn-primary" onClick={() => showReport(ev)}>Reporte</button>
            </div>
          </div>
        ))}
      </div>

      {form && <EventFormModal event={form.event} onClose={() => setForm(null)} onSaved={saved} />}
      {report && <ReportModal {...report} onClose={() => setReport(null)} />}
      {action && <ConfirmDialog action={action} onClose={() => setAction(null)} />}
    </main>
  );
}

export default function OrganizerPortal() {
  usePageTitle('Mi portal');
  return <RequireAuth organizer><PortalContent /></RequireAuth>;
}
