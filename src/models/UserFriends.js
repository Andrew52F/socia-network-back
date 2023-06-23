import { Schema, model } from "mongoose";


const UserFriendsSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, ref: 'User'},
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  invited: [{type: Schema.Types.ObjectId, ref: 'User'}], // to other users
  invitations: [{type: Schema.Types.ObjectId, ref: 'User'}], // from other users
});

export default model('UserFriends', UserFriendsSchema);
