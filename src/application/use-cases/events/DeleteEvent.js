const { findOwnedEvent } = require('./eventAccess');

class DeleteEvent {
  constructor({ events }) {
    this.events = events;
  }

  async execute({ eventId, organizerId }) {
    const event = await findOwnedEvent(
      this.events, eventId, organizerId, 'No puedes eliminar un evento que no organizaste'
    );
    await this.events.delete(event._id);
  }
}

module.exports = DeleteEvent;
