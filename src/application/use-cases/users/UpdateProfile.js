const { InvalidInputError, UnauthenticatedError } = require('../../../domain/errors');
const { isValidEmail, isValidPassword, MIN_PASSWORD_LENGTH } = require('../../../domain/rules/userRules');
const { toPublicUser } = require('./Signup');

class UpdateProfile {
  constructor({ users, hasher }) {
    this.users = users;
    this.hasher = hasher;
  }

  async execute({ userId, name, email, currentPassword, newPassword }) {
    const user = await this.users.findById(userId, { withPassword: true });
    const changes = {};

    if (name) changes.name = name;
    if (email && email.toLowerCase() !== user.email) {
      changes.email = await this.validatedNewEmail(email);
    }
    if (newPassword) {
      changes.password = await this.validatedNewPassword(user, currentPassword, newPassword);
    }

    return toPublicUser(await this.users.update(userId, changes));
  }

  async validatedNewEmail(email) {
    if (!isValidEmail(email)) throw new InvalidInputError('Escribe un correo con formato válido');
    const normalized = email.toLowerCase();
    if (await this.users.findByEmail(normalized)) {
      throw new InvalidInputError('Ya existe una cuenta con ese correo');
    }
    return normalized;
  }

  async validatedNewPassword(user, currentPassword, newPassword) {
    if (!isValidPassword(newPassword)) {
      throw new InvalidInputError(`La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }
    if (!currentPassword) {
      throw new InvalidInputError('Debes ingresar tu contraseña actual para cambiarla');
    }
    if (!(await this.hasher.compare(currentPassword, user.password))) {
      throw new UnauthenticatedError('La contraseña actual no es correcta');
    }
    return this.hasher.hash(newPassword);
  }
}

module.exports = UpdateProfile;
