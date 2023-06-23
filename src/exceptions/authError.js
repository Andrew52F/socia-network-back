class AuthError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new AuthError(401, 'User is not authorized')
  }

  static NotActivated() {
    return new AuthError(450, 'Users email is not activated');
  }
  static IsForbidden(roles) {
    return new AuthError(403, `Access is forbidden. Your roles: ${roles.join(', ')}. `);
  }

  static BadRequest(message, errors = []) {
    return new AuthError(400, message, errors)
  }

}

export default  AuthError;