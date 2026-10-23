const { UnauthenticatedError } = require('../../../domain/errors');
const { toPublicUser } = require('./Signup');

class Login {
  constructor({ users, hasher, tokens }) {
    this.users = users;
    this.hasher = hasher;
    this.tokens = tokens;
  }

  async execute({ email, password }) {
    const user = email && password
      ? await this.users.findByEmail(email, { withPassword: true })
      : null;

    if (!user || !(await this.hasher.compare(password, user.password))) {
      throw new UnauthenticatedError('Correo o contraseña incorrectos');
    }

    return { token: this.tokens.sign({ id: user._id }), user: toPublicUser(user) };
  }
}

module.exports = Login;
