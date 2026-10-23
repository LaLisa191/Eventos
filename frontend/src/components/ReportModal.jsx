import Modal from './Modal';

// Reporte de asistencia: lista de inscritos al momento de generarlo
export default function ReportModal({ eventName, report, onClose }) {
  const { totalRegistered, maxCapacity, participants } = report.data;
  return (
    <Modal onClose={onClose} cardStyle={{ maxWidth: 560 }}>
      <h3>Reporte — {eventName}</h3>
      <div className="meta" style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
        {totalRegistered} inscritos de {maxCapacity} cupos · generado el {new Date(report.generatedAt).toLocaleString('es-CO')}
      </div>
      <table className="data-table">
        <thead><tr><th>Participante</th><th>Correo</th><th>Fecha de registro</th></tr></thead>
        <tbody>
          {participants.length === 0
            ? <tr><td colSpan="3">Todavía no hay participantes inscritos.</td></tr>
            : participants.map((p, i) => (
              <tr key={`${p.email}-${i}`}>
                <td>{p.name}</td><td>{p.email}</td><td>{new Date(p.date).toLocaleDateString('es-CO')}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Modal>
  );
}
