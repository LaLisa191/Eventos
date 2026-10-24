const { RegistrationNotifier } = require('../../application/ports');
const mailer = require('./mailer');

class EmailRegistrationNotifier extends RegistrationNotifier {
  // El caso de uso no espera este envío: lo lanza sin bloquear la respuesta y registra el error si falla
  async notifyRegistration(email, event) {
    await mailer.enviarConfirmacionRegistro(email, event);
  }
}

module.exports = EmailRegistrationNotifier;