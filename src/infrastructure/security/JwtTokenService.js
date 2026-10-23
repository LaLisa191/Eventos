const jwt = require('jsonwebtoken');
const { TokenService } = require('../../application/ports');

class JwtTokenService extends TokenService {
  constructor({ secret, expiresIn = '7d' }) {
    super();
    this.secret = secret; // función: el secreto se lee de la variable de entorno al usarlo
    this.expiresIn = expiresIn;
  }

  sign(payload) {
    return jwt.sign(payload, this.secret(), { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret());
  }
}

module.exports = JwtTokenService;
