import { occupiedPercent } from '../utils/format';

export default function SeatsBar({ event }) {
  return (
    <>
      <div className="cupo-bar-track"><div className="cupo-bar-fill" style={{ width: `${occupiedPercent(event)}%` }}></div></div>
      <div className="cupo-label">
        <span>{event.availableSpots} cupos libres</span>
        <span>{event.maxCapacity} en total</span>
      </div>
    </>
  );
}
