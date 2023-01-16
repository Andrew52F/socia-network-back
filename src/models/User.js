import { Schema, model } from "mongoose";


const UserSchema = new Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  roles: [{type: String, ref: 'Role' }],
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String, required: true},
})

export default model('User', UserSchema);


// const UserSchema = new Schema({
//   title: {
//     firstName: {
//       type: String,
//       required: true, 
//     },
//     lastName: {
//       type: String,
//       required: true, 
//     },
//     information: String,
//     city: String,
//     isMale: Boolean,
//     birthDay: {
//       type: Date,
//     },
//     registrationDate: {
//       type: Date,
//       default: Date.now,
//     }
//   },
// })