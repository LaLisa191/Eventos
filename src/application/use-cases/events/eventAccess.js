const { InvalidInputError, NotFoundError, ForbiddenError } = require('../../../domain/errors');
const { isOrganizedBy } = require('../../../domain/rules/eventRules');

// Busca un evento y falla si el id es inválido o el evento no existe
async function findExistingEvent(events, id) {
  if (!events.isValidId(id)) throw new InvalidInputError('Id de evento inválido');
  const event = await events.findById(id);
  if (!event) throw new NotFoundError('Evento no encontrado');
  return event;
}

// Igual que findExistingEvent, pero además exige que el usuario sea quien organiza el evento
async function findOwnedEvent(events, id, userId, forbiddenMessage) {
  const event = await findExistingEvent(events, id);
  if (!isOrganizedBy(event, userId)) throw new ForbiddenError(forbiddenMessage);
  return event;
}

module.exports = { findExistingEvent, findOwnedEvent };
