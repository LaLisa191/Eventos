import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import EventFormModal from '../components/EventFormModal';
import EventImage from '../components/EventImage';
import SeatsBar from '../components/SeatsBar';
import usePageTitle from '../hooks/usePageTitle';
import { createdAtOf, formatDateTime, modalityLabel, occupiedPercent } from '../utils/format';

const PAGE_SIZE = 6;
const DEFAULT_SUBTITLE = 'Consulta los eventos disponibles e inscríbete fácilmente en actividades presenciales y virtuales.';

const BEFORE = [
  'Inscripciones dispersas en WhatsApp, formularios sueltos y hojas de cálculo',
  'Sin control real de cuántos cupos quedan disponibles',
  'El participante no sabe si su registro realmente quedó confirmado',
  'Reportes de asistencia armados a mano, con datos desactualizados'
];
const AFTER = [
  'Registro centralizado, un solo lugar para todos los eventos',
  'Cupo disponible actualizado en tiempo real',
  'Confirmación visual inmediata al inscribirse',
  'Reporte de asistencia generado con un clic'
];

function Hero({ next, canCreate, onCreate }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const hasPhoto = Boolean(next?.imageUrl) && failedUrl !== next.imageUrl;   // si la foto no carga, vuelve la ilustración
  return (
    <section className="hero wrap">
      <div>
        <div className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 10 }}>Empecemos con tu próximo evento</div>
        <h1>Inscríbete a los eventos de tu universidad</h1>
        <p>Consulta los cupos disponibles en tiempo real y recibe la confirmación de tu registro al instante. Participa en los eventos presenciales y virtuales que tenemos disponibles.</p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#eventos" className="btn-primary">Ver eventos disponibles</a>
          {canCreate && <a href="#" className="btn-secondary" onClick={(e) => { e.preventDefault(); onCreate(); }}>+ Crear evento</a>}
        </div>
      </div>

      <div className={`hero-visual listo${hasPhoto ? ' con-foto' : ''}`}>
        {hasPhoto && <img className="hero-event-image" src={next.imageUrl} alt={next.name} onError={() => setFailedUrl(next.imageUrl)} />}
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustración de un evento con una persona presentando en un escenario">
          <polygon points="200,10 90,270 310,270" fill="white" opacity="0.06" />
          <ellipse cx="200" cy="262" rx="140" ry="16" fill="white" opacity="0.14" />
          <circle cx="90" cy="60" r="4" fill="white" opacity="0.35" />
          <circle cx="320" cy="90" r="3" fill="white" opacity="0.3" />
          <circle cx="60" cy="150" r="3" fill="white" opacity="0.25" />
          <circle cx="340" cy="180" r="4" fill="white" opacity="0.3" />
          <path d="M170 250 C170 190 172 165 200 160 C228 165 230 190 230 250 Z" fill="white" opacity="0.9" />
          <circle cx="200" cy="128" r="24" fill="white" opacity="0.95" />
          <circle cx="130" cy="240" r="7" fill="white" opacity="0.35" />
          <circle cx="150" cy="248" r="7" fill="white" opacity="0.3" />
          <circle cx="250" cy="248" r="7" fill="white" opacity="0.3" />
          <circle cx="270" cy="240" r="7" fill="white" opacity="0.35" />
        </svg>

        {next && (
          <div className="preview-card">
            <div className="eyebrow">Próximo evento</div>
            <h3>{next.name}</h3>
            <div className="meta">{formatDateTime(next.date)} · {next.location}</div>
            <div className="cupo-bar-track"><div className="cupo-bar-fill" style={{ width: `${occupiedPercent(next)}%` }}></div></div>
            <div className="cupo-label">
              <span>{next.availableSpots} cupos disponibles</span>
              <span>Cupo máximo: {next.maxCapacity}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Compare() {
  const list = (items, icon) => items.map(t => <li key={t}><span className="compare-icon">{icon}</span> {t}</li>);
  return (
    <section className="wrap compare-section">
      <h2 className="section-title">¿Por qué centralizar tus eventos?</h2>
      <p className="section-sub">Así se organizan hoy la mayoría de eventos universitarios, y así se ven con esta plataforma.</p>
      <div className="compare-grid">
        <div className="compare-card before"><h3>Sin plataforma</h3><ul className="compare-list">{list(BEFORE, '✕')}</ul></div>
        <div className="compare-card after"><h3>Con esta plataforma</h3><ul className="compare-list">{list(AFTER, '✓')}</ul></div>
      </div>
    </section>
  );
}

function RegisterButton({ event, registered }) {
  if (registered) return <Link className="btn-primary" to={`/register?event=${event._id}`} style={{ justifyContent: 'center' }}>Ya estás registrado</Link>;
  if (event.availableSpots > 0) return <Link className="btn-primary" to={`/register?event=${event._id}`}>Registrarme</Link>;
  return <button className="btn-primary" disabled>Cupo lleno</button>;
}

export default function Home() {
  usePageTitle('');
  const { user, token, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [params] = useSearchParams();
  const modality = params.get('modality');

  const [events, setEvents] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [registered, setRegistered] = useState(new Set());
  const [search, setSearch] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    try {
      const [list, favs, regs] = await Promise.all([
        api.events(),
        token ? api.favorites(token).catch(() => []) : [],
        token ? api.myRegistrations(token).catch(() => []) : []
      ]);
      setEvents([...list].sort((a, b) => createdAtOf(b) - createdAtOf(a)));   // más nuevos primero
      setFavorites(new Set(favs.filter(Boolean).map(f => f._id)));            // null = evento eliminado
      setRegistered(new Set(regs.filter(r => r.status === 'confirmed' && r.eventId).map(r => r.eventId._id)));
      setLoadError('');
    } catch (err) {
      setLoadError(err.message);
      setEvents([]);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  // Al llegar con #eventos, baja a la sección cuando el contenido ya cambió la altura de la página
  useEffect(() => {
    if (hash === '#eventos' && events) {
      requestAnimationFrame(() => document.getElementById('eventos')?.scrollIntoView({ behavior: 'instant' }));
    }
  }, [hash, events !== null]);   // eslint-disable-line react-hooks/exhaustive-deps

  const nextEvent = useMemo(
    () => (events?.length ? [...events].sort((a, b) => new Date(a.date) - new Date(b.date))[0] : null),
    [events]
  );

  const filtered = useMemo(() => {
    let list = events ?? [];
    if (modality) list = list.filter(e => e.modality === modality);
    const term = search.trim().toLowerCase();
    if (term) list = list.filter(e => e.name.toLowerCase().includes(term));
    if (onlyFavorites) list = list.filter(e => favorites.has(e._id));
    return list;
  }, [events, modality, search, onlyFavorites, favorites]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);   // si al filtrar quedan menos páginas, retrocede
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToLogin = () => navigate('/login?next=/');
  const goToPage = (n) => { setPage(n); document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' }); };

  async function toggleFavorite(id) {
    if (!user) return goToLogin();
    const isFav = favorites.has(id);
    try {
      await (isFav ? api.removeFavorite(token, id) : api.addFavorite(token, id));
      setFavorites(prev => {
        const next = new Set(prev);
        if (isFav) next.delete(id); else next.add(id);
        return next;
      });
    } catch { /* si falla, el corazón no cambia */ }
  }

  function toggleOnlyFavorites() {
    if (!user) return goToLogin();
    setPage(1);
    setOnlyFavorites(v => !v);
  }

  return (
    <>
      <Hero next={nextEvent} canCreate={isOrganizer} onCreate={() => setCreating(true)} />
      <Compare />

      <main className="wrap" id="eventos">
        <div className="section-header-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 16 }}>
          <div>
            <h2 className="section-title">Eventos disponibles</h2>
            <p className="section-sub">
              {modality ? `Mostrando eventos ${modalityLabel(modality).toLowerCase()}s. ` : DEFAULT_SUBTITLE}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button className={`fav-toggle${onlyFavorites ? ' active' : ''}`} onClick={toggleOnlyFavorites}>♥ Solo favoritos</button>
            <input type="search" className="search-input" placeholder="Buscar evento por nombre…" aria-label="Buscar evento por nombre"
              value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
          </div>
        </div>

        <div className="events-grid">
          {loadError && <div className="state-box error">{loadError}</div>}
          {!loadError && events === null && <div className="empty-state">Cargando eventos…</div>}
          {events?.length === 0 && !loadError && <div className="empty-state">Todavía no hay eventos publicados.</div>}
          {events?.length > 0 && visible.length === 0 && <div className="empty-state">No hay eventos que coincidan con este filtro por ahora.</div>}
          {visible.map(ev => {
            const isFav = favorites.has(ev._id);
            return (
              <div className="event-card" key={ev._id}>
                <EventImage event={ev} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <h3>{ev.name}</h3>
                  <button className={`fav-btn${isFav ? ' active' : ''}`} onClick={() => toggleFavorite(ev._id)}
                    aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}>{isFav ? '♥' : '♡'}</button>
                </div>
                <div className="meta">{formatDateTime(ev.date)} · {ev.location} · {modalityLabel(ev.modality)}</div>
                <SeatsBar event={ev} />
                <RegisterButton event={ev} registered={registered.has(ev._id)} />
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 24 }}>
            <button className="btn-secondary" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>← Anterior</button>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Página {currentPage} de {totalPages}</span>
            <button className="btn-secondary" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Siguiente →</button>
          </div>
        )}
      </main>

      {creating && <EventFormModal onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </>
  );
}
