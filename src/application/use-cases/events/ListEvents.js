const { availableSpots } = require('../../../domain/rules/eventRules');

// RF5: cada evento se lista con los cupos que aún tiene disponibles
class ListEvents {
  constructor({ events, registrations }) {
    this.events = events;
    this.registrations = registrations;
  }

  async execute() {
    const events = await this.events.findAll();
    return Promise.all(events.map(async (event) => {
      const confirmed = await this.registrations.countConfirmed(event._id);
      return { ...event, availableSpots: availableSpots(event, confirmed) };
    }));
  }
}

module.exports = ListEvents;
