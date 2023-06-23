import { Schema, model } from "mongoose";


const PageSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, required: true},
  birthDate: {type: Date, default: Date.now()},
  imageId: {type: Schema.Types.ObjectId, ref: 'Image', required: false},
  isPublic: {type: Boolean, default: false},
  isPostEveryone: {type: Boolean, default: false},
  
  posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],

})

export default model('User', UserSchema);
