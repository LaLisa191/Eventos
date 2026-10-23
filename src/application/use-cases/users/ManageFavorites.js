// Eventos favoritos del usuario: listar, agregar y quitar
class ManageFavorites {
  constructor({ users }) {
    this.users = users;
  }

  list(userId) {
    return this.users.listFavorites(userId);
  }

  async add(userId, eventId) {
    return { favorites: await this.users.addFavorite(userId, eventId) };
  }

  async remove(userId, eventId) {
    return { favorites: await this.users.removeFavorite(userId, eventId) };
  }
}

module.exports = ManageFavorites;
