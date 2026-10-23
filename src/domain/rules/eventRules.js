const MODALITIES = ['in-person', 'virtual'];

// Valida el formulario de un evento y devuelve la lista de problemas encontrados
function findEventProblems({ name, date, location, maxCapacity, modality }) {
  const problems = [];
  if (!name || !String(name).trim()) problems.push('El nombre es obligatorio');
  if (!date || Number.isNaN(new Date(date).getTime())) problems.push('La fecha no es válida');
  if (!location || !String(location).trim()) problems.push('El lugar es obligatorio');
  if (!Number.isFinite(maxCapacity) || maxCapacity < 1) problems.push('El cupo máximo debe ser un número mayor a 0');
  if (!MODALITIES.includes(modality)) problems.push('La modalidad no es válida');
  return problems;
}

// Convierte los datos crudos del formulario en datos de evento limpios
function normalizeEventData(raw) {
  return {
    name: raw.name?.trim?.() ?? raw.name,
    description: raw.description ?? '',
    date: raw.date,
    location: raw.location?.trim?.() ?? raw.location,
    modality: raw.modality ?? 'in-person',
    maxCapacity: Number(raw.maxCapacity)
  };
}

function availableSpots(event, confirmedCount) {
  return event.maxCapacity - confirmedCount;
}

function hasFreeSpots(event, confirmedCount) {
  return confirmedCount < event.maxCapacity;
}

function isOrganizedBy(event, userId) {
  return String(event.organizerId) === String(userId);
}

function isActive(event) {
  return event?.status === 'active';
}

module.exports = { findEventProblems, normalizeEventData, availableSpots, hasFreeSpots, isOrganizedBy, isActive };
