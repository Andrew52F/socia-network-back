import mongoose, { Schema } from "mongoose";


const CommentSchema = new Schema({
  authorId: {type: Schema.Types.ObjectId, ref: 'User'},
  postId: {type: Schema.Types.ObjectId, ref: 'Post'},
  text: { type: String, required: true },
  imageId: {type: Schema.Types.ObjectId, ref: 'Image', required: false},
  likedUsersId: [{type: Schema.Types.ObjectId, ref: 'User'}],
  dislikedUsersId: [{type: Schema.Types.ObjectId, ref: 'User'}],

  date: { type: Date, default: Date.now },


})

export default mongoose.model('Comment', CommentSchema);