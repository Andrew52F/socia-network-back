import mongoose, { Schema } from "mongoose";


const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }
})

export default mongoose.model('Post', PostSchema);