const { InvalidInputError, NotFoundError, ForbiddenError } = require('../../../domain/errors');
const { isOwnedBy } = require('../../../domain/rules/registrationRules');

class CancelRegistration {
  constructor({ registrations }) {
    this.registrations = registrations;
  }

  async execute({ registrationId, userId }) {
    if (!this.registrations.isValidId(registrationId)) throw new InvalidInputError('Id inválido');

    const registration = await this.registrations.findById(registrationId);
    if (!registration) throw new NotFoundError('Registro no encontrado');
    if (!isOwnedBy(registration, userId)) {
      throw new ForbiddenError('No puedes cancelar un registro que no es tuyo');
    }
    return this.registrations.cancel(registration._id);
  }
}

module.exports = CancelRegistration;
