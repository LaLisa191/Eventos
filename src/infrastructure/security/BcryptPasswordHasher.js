const bcrypt = require('bcryptjs');
const { PasswordHasher } = require('../../application/ports');

const SALT_ROUNDS = 10;

class BcryptPasswordHasher extends PasswordHasher {
  hash(plain) {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  compare(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = BcryptPasswordHasher;
