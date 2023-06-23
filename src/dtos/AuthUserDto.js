//data transfer object
export default class AuthUserDto {
  email;
  id;
  isActivated;
  roles;
  isUserCreated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.roles = model.roles;
  }
}