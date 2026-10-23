// Cliente HTTP único: agrega el token, interpreta la respuesta y avisa cuando la sesión venció.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const SESSION_EXPIRED_EVENT = 'session-expired';

export async function request(path, { method = 'GET', token, json, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(path, { method, headers, body: form ?? (json !== undefined ? JSON.stringify(json) : undefined) });
  } catch {
    throw new ApiError('No hay conexión con el servidor. Inténtalo de nuevo.', 0);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Un 401 con token significa que la sesión venció o ya no es válida: se cierra y se avisa
    if (response.status === 401 && token) window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    throw new ApiError(data.message || 'No se pudo completar la acción.', response.status);
  }
  return data;
}
