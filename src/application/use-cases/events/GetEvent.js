const { availableSpots } = require('../../../domain/rules/eventRules');
const { findExistingEvent } = require('./eventAccess');

class GetEvent {
  constructor({ events, registrations }) {
    this.events = events;
    this.registrations = registrations;
  }

  async execute({ eventId }) {
    const event = await findExistingEvent(this.events, eventId);
    const confirmed = await this.registrations.countConfirmed(event._id);
    return { ...event, availableSpots: availableSpots(event, confirmed) };
  }
}

module.exports = GetEvent;
