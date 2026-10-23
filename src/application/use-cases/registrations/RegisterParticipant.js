const { InvalidInputError } = require('../../../domain/errors');
const { hasFreeSpots } = require('../../../domain/rules/eventRules');
const { findExistingEvent } = require('../events/eventAccess');

// RF3, RF4, RF5: inscribe al usuario autenticado si el evento todavía tiene cupo
class RegisterParticipant {
  constructor({ events, registrations, notifier }) {
    this.events = events;
    this.registrations = registrations;
    this.notifier = notifier;
  }

  async execute({ eventId, user }) {
    const event = await findExistingEvent(this.events, eventId);

    const confirmed = await this.registrations.countConfirmed(event._id);
    if (!hasFreeSpots(event, confirmed)) {
      throw new InvalidInputError('Este evento ya no tiene cupos disponibles');
    }

    if (await this.registrations.findConfirmed(event._id, user._id)) {
      throw new InvalidInputError('Ya estás registrado en este evento');
    }

    const registration = await this.registrations.create({ eventId: event._id, participantId: user._id });
    this.notifyInBackground(user.email, event);
    return registration;
  }

  // RF4 + RNF2: la confirmación visual es inmediata, por eso no se espera al correo
  notifyInBackground(email, event) {
    Promise.resolve(this.notifier.notifyRegistration(email, event)).catch(err => {
      console.error('No se pudo enviar el correo de confirmación:', err.message);
    });
  }
}

module.exports = RegisterParticipant;
