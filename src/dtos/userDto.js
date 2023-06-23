export default class UserDto {
  id;
  username;
  image;

  constructor(userModel, imageModel) {
    this.id = userModel.id
    this.username = userModel.username;
    (imageModel &&  (this.image = imageModel.url))
  }
}