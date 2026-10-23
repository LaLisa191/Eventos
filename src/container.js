// Raíz de composición: el único lugar donde se eligen los adaptadores concretos
// y se conectan con los casos de uso.
const MongooseEventRepository = require('./infrastructure/persistence/mongoose/repositories/MongooseEventRepository');
const MongooseRegistrationRepository = require('./infrastructure/persistence/mongoose/repositories/MongooseRegistrationRepository');
const MongooseUserRepository = require('./infrastructure/persistence/mongoose/repositories/MongooseUserRepository');
const MongooseReportRepository = require('./infrastructure/persistence/mongoose/repositories/MongooseReportRepository');
const BcryptPasswordHasher = require('./infrastructure/security/BcryptPasswordHasher');
const JwtTokenService = require('./infrastructure/security/JwtTokenService');
const EmailRegistrationNotifier = require('./infrastructure/mail/EmailRegistrationNotifier');
const QRCodeGenerator = require('./infrastructure/qr/QRCodeGenerator');

const CreateEvent = require('./application/use-cases/events/CreateEvent');
const UpdateEvent = require('./application/use-cases/events/UpdateEvent');
const DeleteEvent = require('./application/use-cases/events/DeleteEvent');
const ListEvents = require('./application/use-cases/events/ListEvents');
const GetEvent = require('./application/use-cases/events/GetEvent');
const GenerateReport = require('./application/use-cases/events/GenerateReport');
const ListReports = require('./application/use-cases/events/ListReports');
const GenerateEventQr = require('./application/use-cases/events/GenerateEventQr');
const RegisterParticipant = require('./application/use-cases/registrations/RegisterParticipant');
const ListEventRegistrations = require('./application/use-cases/registrations/ListEventRegistrations');
const CancelRegistration = require('./application/use-cases/registrations/CancelRegistration');
const DeleteRegistration = require('./application/use-cases/registrations/DeleteRegistration');
const ListMyRegistrations = require('./application/use-cases/registrations/ListMyRegistrations');
const DeleteMyCancelledRegistrations = require('./application/use-cases/registrations/DeleteMyCancelledRegistrations');
const Signup = require('./application/use-cases/users/Signup');
const Login = require('./application/use-cases/users/Login');
const UpdateProfile = require('./application/use-cases/users/UpdateProfile');
const ManageFavorites = require('./application/use-cases/users/ManageFavorites');

function buildContainer() {
  // Adaptadores de salida
  const events = new MongooseEventRepository();
  const registrations = new MongooseRegistrationRepository();
  const users = new MongooseUserRepository();
  const reports = new MongooseReportRepository();
  const hasher = new BcryptPasswordHasher();
  const tokens = new JwtTokenService({ secret: () => process.env.JWT_SECRET });
  const notifier = new EmailRegistrationNotifier();
  const qrCodes = new QRCodeGenerator();
  const appUrl = () => process.env.APP_URL;

  const useCases = {
    createEvent: new CreateEvent({ events }),
    updateEvent: new UpdateEvent({ events }),
    deleteEvent: new DeleteEvent({ events }),
    listEvents: new ListEvents({ events, registrations }),
    getEvent: new GetEvent({ events, registrations }),
    generateReport: new GenerateReport({ events, registrations, reports }),
    listReports: new ListReports({ events, reports }),
    generateEventQr: new GenerateEventQr({ events, qrCodes, appUrl }),
    registerParticipant: new RegisterParticipant({ events, registrations, notifier }),
    listEventRegistrations: new ListEventRegistrations({ events, registrations }),
    cancelRegistration: new CancelRegistration({ registrations }),
    deleteRegistration: new DeleteRegistration({ events, registrations }),
    listMyRegistrations: new ListMyRegistrations({ registrations }),
    deleteMyCancelledRegistrations: new DeleteMyCancelledRegistrations({ registrations }),
    signup: new Signup({ users, hasher }),
    login: new Login({ users, hasher, tokens }),
    updateProfile: new UpdateProfile({ users, hasher }),
    favorites: new ManageFavorites({ users })
  };

  return { useCases, tokens, users };
}

module.exports = buildContainer;
