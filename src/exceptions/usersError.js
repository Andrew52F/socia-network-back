class UsersError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new UsersError(401, 'Users profile is not created')
  }

  static NotFound() {
    return new UsersError(404, 'User is not found')
  }

  static IsForbidden() {
    return new UsersError(403, `Access is forbidden. Only owner can do this `);
  }
  
  static BadRequest(message, errors = []) {
    return new UsersError(400, message, errors)
  }
}

export default  UsersError;