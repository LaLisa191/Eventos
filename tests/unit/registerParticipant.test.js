const RegisterParticipant = require('../../src/application/use-cases/registrations/RegisterParticipant');
const { InvalidInputError, NotFoundError } = require('../../src/domain/errors');
const { FakeEventRepository, FakeRegistrationRepository, FakeNotifier, newId } = require('./fakes');

function crearEscenario({ cupo = 2, notifier = new FakeNotifier() } = {}) {
  const event = { _id: newId(), name: 'Charla', maxCapacity: cupo, status: 'active' };
  const events = new FakeEventRepository([event]);
  const registrations = new FakeRegistrationRepository();
  const useCase = new RegisterParticipant({ events, registrations, notifier });
  return { event, registrations, notifier, useCase };
}

const usuario = () => ({ _id: newId(), email: 'ana@example.com' });

describe('RegisterParticipant', () => {
  test('inscribe al usuario y le envía la confirmación', async () => {
    const { event, useCase, registrations, notifier } = crearEscenario();
    const user = usuario();

    const registration = await useCase.execute({ eventId: event._id, user });

    expect(registration.status).toBe('confirmed');
    expect(await registrations.countConfirmed(event._id)).toBe(1);
    await new Promise(setImmediate);
    expect(notifier.sent).toEqual([{ email: 'ana@example.com', event }]);
  });

  test('rechaza la inscripción cuando el cupo está lleno (RF5)', async () => {
    const { event, useCase } = crearEscenario({ cupo: 1 });
    await useCase.execute({ eventId: event._id, user: usuario() });

    await expect(useCase.execute({ eventId: event._id, user: usuario() }))
      .rejects.toThrow('Este evento ya no tiene cupos disponibles');
  });

  test('no permite inscribirse dos veces al mismo evento', async () => {
    const { event, useCase } = crearEscenario();
    const user = usuario();
    await useCase.execute({ eventId: event._id, user });

    await expect(useCase.execute({ eventId: event._id, user }))
      .rejects.toThrow('Ya estás registrado en este evento');
  });

  test('falla con un evento inexistente y con un id inválido', async () => {
    const { useCase } = crearEscenario();

    await expect(useCase.execute({ eventId: newId(), user: usuario() })).rejects.toBeInstanceOf(NotFoundError);
    await expect(useCase.execute({ eventId: 'abc', user: usuario() })).rejects.toBeInstanceOf(InvalidInputError);
  });

  test('si el correo falla, la inscripción igual se confirma (RNF2)', async () => {
    const silenciar = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { event, useCase } = crearEscenario({ notifier: new FakeNotifier({ fails: true }) });

    await expect(useCase.execute({ eventId: event._id, user: usuario() })).resolves.toMatchObject({ status: 'confirmed' });
    await new Promise(setImmediate);
    expect(silenciar).toHaveBeenCalled();
    silenciar.mockRestore();
  });
});
