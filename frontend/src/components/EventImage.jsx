import { useState } from 'react';

// Imagen de la tarjeta; si no existe o falla al cargar, muestra el recuadro de relleno
export default function EventImage({ event }) {
  const [failed, setFailed] = useState(false);
  if (!event.imageUrl || failed) return <div className="event-image-placeholder"></div>;
  return <img className="event-image" src={event.imageUrl} alt={`Imagen de ${event.name}`} loading="lazy" onError={() => setFailed(true)} />;
}
