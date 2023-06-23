import { Schema, model } from "mongoose";


const NotificationSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  someoneId: {type: Schema.Types.ObjectId, ref: 'User'},
  type: {type: String, required: true},
  data: {
    where: {type: String},
    structure: {type: String},
    text: {type: String, required: true},
    code: {type: String, required: true},
  },
  date: { type: Date, default: Date.now },

})

export default model('Notification', NotificationSchema);
