const CreateEvent = require('../../src/application/use-cases/events/CreateEvent');
const UpdateEvent = require('../../src/application/use-cases/events/UpdateEvent');
const DeleteEvent = require('../../src/application/use-cases/events/DeleteEvent');
const { ForbiddenError } = require('../../src/domain/errors');
const { FakeEventRepository, newId } = require('./fakes');

const formulario = (extra = {}) => ({
  name: 'Congreso', description: '', date: '2027-03-10T15:00:00.000Z',
  location: 'Auditorio', modality: 'virtual', maxCapacity: '30', ...extra
});

describe('CreateEvent', () => {
  test('crea el evento normalizando los datos', async () => {
    const events = new FakeEventRepository();
    const organizerId = newId();

    const event = await new CreateEvent({ events }).execute({
      organizerId, form: formulario({ name: '  Congreso  ', location: ' Auditorio ' })
    });

    expect(event).toMatchObject({ name: 'Congreso', location: 'Auditorio', maxCapacity: 30, organizerId });
  });

  test('rechaza datos inválidos con la lista de problemas', async () => {
    const useCase = new CreateEvent({ events: new FakeEventRepository() });

    await expect(useCase.execute({ organizerId: newId(), form: formulario({ name: '', maxCapacity: 'abc' }) }))
      .rejects.toThrow(/Revisa el formulario: .*nombre.*cupo/);
  });

  test('rechaza dos eventos activos en el mismo lugar y hora', async () => {
    const useCase = new CreateEvent({ events: new FakeEventRepository() });
    await useCase.execute({ organizerId: newId(), form: formulario() });

    await expect(useCase.execute({ organizerId: newId(), form: formulario() }))
      .rejects.toThrow('Ya existe un evento activo');
  });
});

describe('UpdateEvent y DeleteEvent', () => {
  test('solo el organizador dueño puede editar o eliminar', async () => {
    const events = new FakeEventRepository();
    const duenio = newId();
    const event = await new CreateEvent({ events }).execute({ organizerId: duenio, form: formulario() });

    await expect(new UpdateEvent({ events }).execute({
      eventId: event._id, organizerId: newId(), form: formulario()
    })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(new DeleteEvent({ events }).execute({ eventId: event._id, organizerId: newId() }))
      .rejects.toBeInstanceOf(ForbiddenError);

    const editado = await new UpdateEvent({ events }).execute({
      eventId: event._id, organizerId: duenio, form: formulario({ name: 'Congreso 2' })
    });
    expect(editado.name).toBe('Congreso 2');

    await new DeleteEvent({ events }).execute({ eventId: event._id, organizerId: duenio });
    expect(await events.findById(event._id)).toBeNull();
  });
});
