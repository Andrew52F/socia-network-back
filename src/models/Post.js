import mongoose, { Schema } from "mongoose";


const PostSchema = new Schema({
  authorId: {type: Schema.Types.ObjectId, ref: 'User'},
  pageId: {type: Schema.Types.ObjectId, ref: 'Page', required: false},
  text: { type: String, required: true },
  imageId: {type: Schema.Types.ObjectId, ref: 'Image', required: false},
  likedUsersId: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dislikedUsersId: [{type: Schema.Types.ObjectId, ref: 'User'}],

  // commentsId: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  date: { type: Date, default: Date.now },


})

export default mongoose.model('Post', PostSchema);