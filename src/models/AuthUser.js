import { Schema, model } from "mongoose";

const AuthUserSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  roles: [{type: String, ref: 'Role' }],
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String, required: true},
})

export default model('AuthUser', AuthUserSchema);
