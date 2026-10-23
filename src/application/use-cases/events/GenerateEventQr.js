const { InvalidInputError, NotFoundError } = require('../../../domain/errors');
const { isActive } = require('../../../domain/rules/eventRules');

// Genera el QR que lleva a la página de registro de un evento activo
class GenerateEventQr {
  constructor({ events, qrCodes, appUrl }) {
    this.events = events;
    this.qrCodes = qrCodes;
    this.appUrl = appUrl; // función, para leer la variable de entorno en el momento de usarla
  }

  async execute({ eventId }) {
    if (!this.events.isValidId(eventId)) throw new InvalidInputError('Id de evento inválido');

    const event = await this.events.findById(eventId);
    if (!isActive(event)) throw new NotFoundError('Evento no disponible');

    const url = `${this.appUrl()}/register.html?event=${event._id}`;
    const qr = await this.qrCodes.toDataUrl(url);
    return { eventId: event._id, url, qr };
  }
}

module.exports = GenerateEventQr;
