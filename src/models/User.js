import { Schema, model } from "mongoose";


const UserSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, ref: 'AuthUser'},
  username: {type: String, unique: true, required: true},
  name: {type: String, required: true},
  surname: {type: String, required: true},
  isMale: {type: String, default: true},
  birthDate: {type: Date},
  imageId: {type: Schema.Types.ObjectId, ref: 'Image', required: false},

  // friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  // persecutedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  // pages: [{type: Schema.Types.ObjectId, ref: 'Page'}],

  // posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],

})

export default model('User', UserSchema);
