export const modalityLabel = (m) => (m === 'virtual' ? 'Virtual' : 'Presencial');

// "30 sept · 14:00"
export function formatDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

// Porcentaje de cupos OCUPADOS (la barra muestra lo ocupado, no lo libre)
export function occupiedPercent(event) {
  const capacity = Number(event.maxCapacity);
  const available = Number(event.availableSpots);
  if (!Number.isFinite(capacity) || capacity <= 0 || !Number.isFinite(available)) return 0;
  return Math.max(0, Math.min(100, ((capacity - available) / capacity) * 100));
}

export function isValidEmail(email) {
  const at = email.indexOf('@');
  if (at <= 0) return false;
  const domain = email.slice(at + 1);
  return domain.includes('.') && !/\s/.test(email);
}

// Fecha del evento -> valores para <input type="date"> y <input type="time"> en hora local
export function toDateAndTimeInputs(iso) {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`
  };
}

// Momento de creación: usa createdAt o, si falta, el timestamp que lleva el _id de Mongo
export function createdAtOf(event) {
  return event.createdAt
    ? new Date(event.createdAt).getTime()
    : Number.parseInt(event._id.substring(0, 8), 16) * 1000;
}
