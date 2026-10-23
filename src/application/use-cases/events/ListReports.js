const { findOwnedEvent } = require('./eventAccess');

class ListReports {
  constructor({ events, reports }) {
    this.events = events;
    this.reports = reports;
  }

  async execute({ eventId, organizerId }) {
    const event = await findOwnedEvent(
      this.events, eventId, organizerId, 'No puedes ver los reportes de un evento que no organizaste'
    );
    return this.reports.listByEvent(event._id);
  }
}

module.exports = ListReports;
