const { InvalidInputError, NotFoundError, ForbiddenError } = require('../../../domain/errors');
const { isOwnedBy, canBeDeleted } = require('../../../domain/rules/registrationRules');

// Elimina del historial una inscripción CANCELADA (solo la del propio usuario)
class DeleteRegistration {
  constructor({ events, registrations }) {
    this.events = events;
    this.registrations = registrations;
  }

  async execute({ eventId, registrationId, userId }) {
    if (!this.events.isValidId(eventId) || !this.registrations.isValidId(registrationId)) {
      throw new InvalidInputError('Id inválido');
    }

    const registration = await this.registrations.findInEvent(eventId, registrationId);
    if (!registration) throw new NotFoundError('Registro no encontrado');
    if (!isOwnedBy(registration, userId)) {
      throw new ForbiddenError('No puedes eliminar un registro que no es tuyo');
    }
    if (!canBeDeleted(registration)) {
      throw new InvalidInputError('Solo puedes eliminar inscripciones canceladas');
    }
    await this.registrations.delete(registration._id);
  }
}

module.exports = DeleteRegistration;
