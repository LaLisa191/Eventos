const { RegistrationNotifier } = require('../../application/ports');
const mailer = require('./mailer');

class EmailRegistrationNotifier extends RegistrationNotifier {
  notifyRegistration(email, event) {
    return mailer.enviarConfirmacionRegistro(email, event);
  }
}

module.exports = EmailRegistrationNotifier;
