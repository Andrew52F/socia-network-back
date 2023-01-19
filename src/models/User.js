import { Schema, model } from "mongoose";


const UserSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  username: {type: String, unique: true, required: true},
  name: {type: String},
  surname: {type: String},
  patronymic: {type: String},
  isMale: {type: String},
  country: {type: String},
  birthDate: {type: Date},
})

export default model('User', UserSchema);
