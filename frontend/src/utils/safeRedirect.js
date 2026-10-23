// Solo se permiten rutas internas en ?next= (evita redirigir a sitios externos)
export function safeNext(next, fallback = '/') {
  if (!next) return fallback;
  const path = next.startsWith('/') ? next : `/${next}`;
  return path.startsWith('//') ? fallback : path;
}
