import { useState } from 'react';
import Modal from './Modal';
import StateBox from './StateBox';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { toDateAndTimeInputs } from '../utils/format';

const FIELDS = [
  { key: 'name', label: 'Nombre del evento' },
  { key: 'description', label: 'Descripción' },
  { key: 'date', label: 'Fecha' },
  { key: 'time', label: 'Hora' },
  { key: 'location', label: 'Lugar' },
  { key: 'capacity', label: 'Cupo máximo' }
];

function initialValues(event) {
  if (!event) return { name: '', description: '', date: '', time: '', location: '', modality: 'in-person', capacity: '' };
  const { date, time } = toDateAndTimeInputs(event.date);
  return {
    name: event.name, description: event.description || '', date, time,
    location: event.location, modality: event.modality || 'in-person', capacity: String(event.maxCapacity)
  };
}

// Formulario para crear (event = null) o editar un evento
export default function EventFormModal({ event = null, onClose, onSaved }) {
  const { token } = useAuth();
  const [values, setValues] = useState(() => initialValues(event));
  const [image, setImage] = useState(null);
  const [invalid, setInvalid] = useState({});
  const [problems, setProblems] = useState([]);
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => {
    setValues(v => ({ ...v, [key]: e.target.value }));
    setInvalid(i => ({ ...i, [key]: false }));
  };

  function validate() {
    const found = [];
    const marked = {};
    FIELDS.forEach(({ key, label }) => {
      const value = values[key].trim();
      let message = null;
      if (!value) message = `${label} es obligatorio`;
      else if (key === 'capacity' && (!Number.isInteger(Number(value)) || Number(value) < 1)) {
        message = 'El cupo máximo debe ser un número entero mayor a 0';
      }
      if (message) { found.push(message); marked[key] = true; }
    });
    setInvalid(marked);
    setProblems(found);
    return found.length === 0;
  }

  async function submit() {
    setServerError('');
    if (!validate()) return;

    const form = new FormData();   // FormData porque puede incluir un archivo
    form.append('name', values.name.trim());
    form.append('description', values.description.trim());
    form.append('date', `${values.date}T${values.time}`);   // el backend espera fecha y hora en un solo valor
    form.append('location', values.location.trim());
    form.append('modality', values.modality);
    form.append('maxCapacity', values.capacity);
    if (image) form.append('image', image);

    setSaving(true);
    try {
      if (event) await api.updateEvent(token, event._id, form);
      else await api.createEvent(token, form);
      onSaved();
    } catch (err) {
      // Los mensajes técnicos solo se muestran si son de validación o de conflicto
      setServerError(err.status === 0 ? err.message : err.message || 'No se pudo guardar el evento.');
    } finally {
      setSaving(false);
    }
  }

  const cls = (key) => (invalid[key] ? 'campo-error' : undefined);

  return (
    <Modal onClose={onClose}>
      <h3>{event ? 'Editar evento' : 'Crear evento'}</h3>
      {!event && (
        <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
          Se publicará de inmediato en la lista de eventos disponibles.
        </div>
      )}

      <label htmlFor="ceNombre">Nombre del evento</label>
      <input id="ceNombre" className={cls('name')} value={values.name} onChange={set('name')} placeholder="Semana de innovación IHC" />

      <label htmlFor="ceDescripcion">Descripción</label>
      <textarea id="ceDescripcion" className={cls('description')} value={values.description} onChange={set('description')}
        placeholder="Breve descripción para los participantes" />

      <label htmlFor="ceFecha">Fecha</label>
      <input id="ceFecha" type="date" className={cls('date')} value={values.date} onChange={set('date')} />

      <label htmlFor="ceHora">Hora</label>
      <input id="ceHora" type="time" className={cls('time')} value={values.time} onChange={set('time')} />

      <label htmlFor="ceLugar">Lugar</label>
      <input id="ceLugar" className={cls('location')} value={values.location} onChange={set('location')} placeholder="Auditorio central" />

      <label htmlFor="ceModalidad">Modalidad</label>
      <select id="ceModalidad" value={values.modality} onChange={set('modality')}>
        <option value="in-person">Presencial</option>
        <option value="virtual">Virtual</option>
      </select>

      <label htmlFor="ceCupo">Cupo máximo</label>
      <input id="ceCupo" type="number" min="1" className={cls('capacity')} value={values.capacity} onChange={set('capacity')} placeholder="50" />

      <label htmlFor="ceImagen">Imagen del evento (opcional)</label>
      <input id="ceImagen" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files[0] ?? null)} />
      {event?.imageUrl && (
        <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>
          Ya tiene una imagen. Elige un archivo solo si quieres reemplazarla.
        </div>
      )}


      {problems.length > 0 && (
        <StateBox>
          Revisa el formulario:
          <ul>{problems.map(p => <li key={p}>{p}</li>)}</ul>
        </StateBox>
      )}
      <StateBox>{serverError}</StateBox>

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 22 }} onClick={submit} disabled={saving}>
        {saving ? 'Guardando…' : event ? 'Guardar' : 'Publicar evento'}
      </button>
    </Modal>
  );
}
