// Errores del dominio. No saben nada de HTTP: cada uno declara qué tipo de problema es
// (`kind`) y la capa HTTP decide con qué código de estado se responde.

class DomainError extends Error {
  constructor(message, kind) {
    super(message);
    this.name = new.target.name;
    this.kind = kind;
  }
}

class InvalidInputError extends DomainError {
  constructor(message) { super(message, 'invalid_input'); }
}

class UnauthenticatedError extends DomainError {
  constructor(message) { super(message, 'unauthenticated'); }
}

class ForbiddenError extends DomainError {
  constructor(message) { super(message, 'forbidden'); }
}

class NotFoundError extends DomainError {
  constructor(message) { super(message, 'not_found'); }
}

module.exports = { DomainError, InvalidInputError, UnauthenticatedError, ForbiddenError, NotFoundError };
