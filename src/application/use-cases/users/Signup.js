const { InvalidInputError } = require('../../../domain/errors');
const { isValidEmail, isValidPassword, isValidUserType, MIN_PASSWORD_LENGTH } = require('../../../domain/rules/userRules');

class Signup {
  constructor({ users, hasher }) {
    this.users = users;
    this.hasher = hasher;
  }

  async execute({ name, email, password, userType }) {
    this.validate({ name, email, password, userType });

    const normalizedEmail = email.toLowerCase();
    if (await this.users.findByEmail(normalizedEmail)) {
      throw new InvalidInputError('Ya existe una cuenta con ese correo');
    }

    const user = await this.users.create({
      name, email: normalizedEmail, password: await this.hasher.hash(password), userType
    });
    return toPublicUser(user);
  }

  validate({ name, email, password, userType }) {
    if (!name || !email || !password || !userType) {
      throw new InvalidInputError('Todos los campos son obligatorios');
    }
    if (!isValidEmail(email)) throw new InvalidInputError('Escribe un correo con formato válido');
    if (!isValidPassword(password)) {
      throw new InvalidInputError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
    }
    if (!isValidUserType(userType)) {
      throw new InvalidInputError('Revisa el formulario: El tipo de usuario no es válido');
    }
  }
}

function toPublicUser(user) {
  return { id: user._id, name: user.name, email: user.email, userType: user.userType };
}

module.exports = Signup;
module.exports.toPublicUser = toPublicUser;
