const { findOwnedEvent } = require('../events/eventAccess');

// Solo el organizador del evento puede ver quién se inscribió
class ListEventRegistrations {
  constructor({ events, registrations }) {
    this.events = events;
    this.registrations = registrations;
  }

  async execute({ eventId, organizerId }) {
    const event = await findOwnedEvent(
      this.events, eventId, organizerId, 'No puedes ver los registros de un evento que no organizaste'
    );
    return this.registrations.listByEvent(event._id, { onlyConfirmed: false });
  }
}

module.exports = ListEventRegistrations;
