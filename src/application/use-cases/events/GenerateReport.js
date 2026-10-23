const { findOwnedEvent } = require('./eventAccess');

// RF7: reporte de asistencia. Guarda una "foto" del evento en el momento de generarlo
class GenerateReport {
  constructor({ events, registrations, reports }) {
    this.events = events;
    this.registrations = registrations;
    this.reports = reports;
  }

  async execute({ eventId, organizerId }) {
    const event = await findOwnedEvent(
      this.events, eventId, organizerId, 'No puedes generar el reporte de un evento que no organizaste'
    );
    const confirmed = await this.registrations.listByEvent(event._id, { onlyConfirmed: true });

    return this.reports.create({
      eventId: event._id,
      type: 'attendance',
      data: {
        totalRegistered: confirmed.length,
        maxCapacity: event.maxCapacity,
        participants: confirmed.map(r => ({
          name: r.participantId?.name,
          email: r.participantId?.email,
          date: r.date
        }))
      }
    });
  }
}

module.exports = GenerateReport;
