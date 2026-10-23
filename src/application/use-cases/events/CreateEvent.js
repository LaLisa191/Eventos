const { InvalidInputError } = require('../../../domain/errors');
const { findEventProblems, normalizeEventData } = require('../../../domain/rules/eventRules');

// RF1: crear un evento, con imagen opcional
class CreateEvent {
  constructor({ events }) {
    this.events = events;
  }

  async execute({ organizerId, form, imageUrl }) {
    const data = normalizeEventData(form);
    const problems = findEventProblems(data);
    if (problems.length) throw new InvalidInputError(`Revisa el formulario: ${problems.join(' / ')}`);

    const conflict = await this.events.findActiveInSlot({ date: new Date(data.date), location: data.location });
    if (conflict) {
      throw new InvalidInputError('Ya existe un evento activo programado en ese lugar y a esa misma hora.');
    }

    return this.events.create({ ...data, organizerId, ...(imageUrl && { imageUrl }) });
  }
}

module.exports = CreateEvent;
