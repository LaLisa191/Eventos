const Signup = require('../../src/application/use-cases/users/Signup');
const Login = require('../../src/application/use-cases/users/Login');
const UpdateProfile = require('../../src/application/use-cases/users/UpdateProfile');
const { FakeUserRepository, FakeHasher, FakeTokenService } = require('./fakes');

const datos = (extra = {}) => ({ name: 'Ana', email: 'Ana@Example.com', password: '123456', userType: 'participant', ...extra });

describe('Signup', () => {
  test('guarda la contraseña cifrada, el correo en minúsculas y no devuelve la contraseña', async () => {
    const users = new FakeUserRepository();

    const publico = await new Signup({ users, hasher: new FakeHasher() }).execute(datos());

    expect(publico).toEqual({ id: expect.any(String), name: 'Ana', email: 'ana@example.com', userType: 'participant' });
    expect(users.items[0].password).toBe('hash:123456');
  });

  test.each([
    [{ name: '' }, 'Todos los campos son obligatorios'],
    [{ email: 'sin-arroba' }, 'Escribe un correo con formato válido'],
    [{ password: '123' }, 'La contraseña debe tener al menos 6 caracteres'],
    [{ userType: 'admin' }, 'El tipo de usuario no es válido']
  ])('rechaza datos inválidos %j', async (cambio, mensaje) => {
    const useCase = new Signup({ users: new FakeUserRepository(), hasher: new FakeHasher() });
    await expect(useCase.execute(datos(cambio))).rejects.toThrow(mensaje);
  });

  test('rechaza un correo ya registrado', async () => {
    const useCase = new Signup({ users: new FakeUserRepository(), hasher: new FakeHasher() });
    await useCase.execute(datos());
    await expect(useCase.execute(datos())).rejects.toThrow('Ya existe una cuenta con ese correo');
  });
});

describe('Login', () => {
  async function conUsuario() {
    const users = new FakeUserRepository();
    const hasher = new FakeHasher();
    await new Signup({ users, hasher }).execute(datos());
    return new Login({ users, hasher, tokens: new FakeTokenService() });
  }

  test('devuelve un token y el usuario con credenciales correctas', async () => {
    const result = await (await conUsuario()).execute({ email: 'ana@example.com', password: '123456' });
    expect(result.token).toMatch(/^token-/);
    expect(result.user.email).toBe('ana@example.com');
    expect(result.user).not.toHaveProperty('password');
  });

  test('rechaza una contraseña incorrecta o un usuario inexistente', async () => {
    const login = await conUsuario();
    await expect(login.execute({ email: 'ana@example.com', password: 'otra' })).rejects.toThrow('Correo o contraseña incorrectos');
    await expect(login.execute({ email: 'nadie@example.com', password: '123456' })).rejects.toThrow('Correo o contraseña incorrectos');
    await expect(login.execute({})).rejects.toThrow('Correo o contraseña incorrectos');
  });
});

describe('UpdateProfile', () => {
  test('exige la contraseña actual correcta para cambiar la contraseña', async () => {
    const users = new FakeUserRepository();
    const hasher = new FakeHasher();
    const creado = await new Signup({ users, hasher }).execute(datos());
    const useCase = new UpdateProfile({ users, hasher });

    await expect(useCase.execute({ userId: creado.id, newPassword: 'nueva123' }))
      .rejects.toThrow('Debes ingresar tu contraseña actual');
    await expect(useCase.execute({ userId: creado.id, currentPassword: 'mal', newPassword: 'nueva123' }))
      .rejects.toThrow('La contraseña actual no es correcta');

    await useCase.execute({ userId: creado.id, currentPassword: '123456', newPassword: 'nueva123' });
    expect(users.items[0].password).toBe('hash:nueva123');
  });
});
