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

  static BadRequest(message, errors = []) {
    return new AuthError(400, message, errors)
  }

}

export default  AuthError;