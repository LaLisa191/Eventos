const USER_TYPES = new Set(['organizer', 'participant']);
const MIN_PASSWORD_LENGTH = 6;

function isValidEmail(email) {
  const at = email.indexOf('@');
  if (at <= 0) return false;
  const domain = email.slice(at + 1);
  return domain.includes('.') && !/\s/.test(email);
}

function isValidPassword(password) {
  return password.length >= MIN_PASSWORD_LENGTH;
}

function isValidUserType(userType) {
  return USER_TYPES.has(userType);
}

module.exports = { isValidEmail, isValidPassword, isValidUserType, MIN_PASSWORD_LENGTH };