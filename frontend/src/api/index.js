import { request } from './client';

export const api = {
  // Usuarios
  login: (email, password) => request('/api/users/login', { method: 'POST', json: { email, password } }),
  signup: (data) => request('/api/users/signup', { method: 'POST', json: data }),
  updateProfile: (token, data) => request('/api/users/me', { method: 'PUT', token, json: data }),
  myRegistrations: (token) => request('/api/users/me/registrations', { token }),
  clearCancelled: (token) => request('/api/users/me/registrations/cancelled', { method: 'DELETE', token }),
  favorites: (token) => request('/api/users/me/favorites', { token }),
  addFavorite: (token, eventId) => request(`/api/users/me/favorites/${eventId}`, { method: 'POST', token }),
  removeFavorite: (token, eventId) => request(`/api/users/me/favorites/${eventId}`, { method: 'DELETE', token }),

  // Eventos
  events: () => request('/api/events'),
  event: (id) => request(`/api/events/${id}`),
  createEvent: (token, form) => request('/api/events', { method: 'POST', token, form }),
  updateEvent: (token, id, form) => request(`/api/events/${id}`, { method: 'PUT', token, form }),
  deleteEvent: (token, id) => request(`/api/events/${id}`, { method: 'DELETE', token }),
  eventQr: (id) => request(`/api/events/qr/${id}/qr`),
  generateReport: (token, id) => request(`/api/events/${id}/reports`, { method: 'POST', token }),

  // Inscripciones
  register: (token, eventId) => request(`/api/events/${eventId}/registrations`, { method: 'POST', token, json: {} }),
  cancelRegistration: (token, eventId, registrationId) =>
    request(`/api/events/${eventId}/registrations/${registrationId}/cancel`, { method: 'PATCH', token }),
  deleteRegistration: (token, eventId, registrationId) =>
    request(`/api/events/${eventId}/registrations/${registrationId}`, { method: 'DELETE', token })
};
