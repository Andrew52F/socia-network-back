export default class ProfileUserDto {
  id;
  username;
  name;
  surname;
  isMale;
  birthDate;
  image;

  constructor(userModel, imageModel) {
    this.id = userModel.id;
    this.username = userModel.username;
    this.name = userModel.name;
    this.surname = userModel.surname;
    this.isMale = userModel.isMale;
    this.birthDate = userModel.birthDate;
    (imageModel &&  (this.image = imageModel.url))
  }
}