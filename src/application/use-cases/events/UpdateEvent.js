const { InvalidInputError } = require('../../../domain/errors');
const { findEventProblems, normalizeEventData } = require('../../../domain/rules/eventRules');
const { findOwnedEvent } = require('./eventAccess');

// Editar un evento: solo su organizador, con imagen nueva opcional
class UpdateEvent {
  constructor({ events }) {
    this.events = events;
  }

  async execute({ eventId, organizerId, form, imageUrl }) {
    const event = await findOwnedEvent(
      this.events, eventId, organizerId, 'No puedes editar un evento que no organizaste'
    );

    const data = normalizeEventData(form);
    const problems = findEventProblems(data);
    if (problems.length) throw new InvalidInputError(`Revisa el formulario: ${problems.join(' / ')}`);

    const conflict = await this.events.findActiveInSlot({
      date: new Date(data.date), location: data.location, excludeId: event._id
    });
    if (conflict) {
      throw new InvalidInputError('Ya existe otro evento activo programado en ese lugar y a esa misma hora.');
    }

    return this.events.update(event._id, { ...data, ...(imageUrl && { imageUrl }) });
  }
}

module.exports = UpdateEvent;
