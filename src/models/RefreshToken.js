import { Schema, model } from "mongoose";


const RefreshTokenSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, ref: 'User'},
  refreshToken: {type: String, required: true},
})

export default model('RefreshToken', RefreshTokenSchema);
