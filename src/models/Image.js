import { Schema, model } from "mongoose";


const ImageSchema = new Schema({
  public_id: {type: String, required: true},
  url: {type: String, required: true}
})

export default model('Image', ImageSchema);
