import User from "../models/User.js";
import UserFriends from "../models/UserFriends.js";
import UsersError from "../exceptions/usersError.js";
import ProfileUserDto from "../dtos/ProfileUserDto.js";
import AuthUserService from "./AuthUserService.js";
import Image from "../models/Image.js";
import imagesService from "./imagesService.js";
import UserDto from "../dtos/UserDto.js";


class UsersFriendsService {

  async inviteFriend(ourId, userId) {

    const ourUserFriends =  await UserFriends.findById(ourId);
    const user = await User.findById(userId).populate('imageId');
    if (!user) {
      throw UsersError.NotFound();
    }
    if (ourId === user.id) {
      throw UsersError.BadRequest('You cant be your friend', ['selffriend']);
    }
    if (ourUserFriends.friends.includes(user.id)) {
      throw UsersError.BadRequest('User is already your friend', ['alreadyFriends']);
    }
    if (ourUserFriends.invited.includes(user.id)) {
      return new UserDto(user, user.imageId);
    }
    const userFriends =  await UserFriends.findById(user.id);

    ourUserFriends.invited.push(user.id);
    userFriends.invitations.push(ourId);
    // console.log('OUR invites: ', ourUserFriends.invited);
    // console.log('USER invitations: ', userFriends.invitations)
    await ourUserFriends.save();
    await userFriends.save();
    return new UserDto(user, user.imageId);
  }

  async acceptFriend(ourId, userId) {
    const ourUserFriends =  await UserFriends.findById(ourId);

    const user = await User.findById(userId).populate('imageId');
    if (!user) {
      throw UsersError.NotFound();
    }
    if (ourUserFriends.friends.includes(user.id)) {
      throw UsersError.BadRequest('User is already your friend', ['alreadyFriends']);
    }
    if (ourUserFriends.invitations.includes(user.id) === false)  {
      throw UsersError.BadRequest('You were not invited to friends', ['notInvited']);
    }
    const userFriends =  await UserFriends.findById(user.id);
    ourUserFriends.invitations = ourUserFriends.invitations.filter((userId) => userId.toString() !== user.id);
    userFriends.invited = userFriends.invited.filter((userId) => userId.toString() !== ourId);
    // console.log('OUR invitations: ', ourUserFriends.invitations);
    // console.log('USER invites: ', userFriends.invites);

    ourUserFriends.friends.push(user.id);
    userFriends.friends.push(ourId);
    // console.log('OUR friends: ', ourUserFriends.friends);
    // console.log('USER friends: ', userFriends.friends);
    await ourUserFriends.save();
    await userFriends.save();
    return new UserDto(user, user.imageId);
  }
  async declineFriend(ourId, userId) {
    const ourUserFriends = await UserFriends.findById(ourId)
    const user = await User.findById(userId).populate('imageId');
    if (!user) {
      throw UsersError.NotFound();
    }
    if (ourUserFriends.friends.includes(user.id)) {
      throw UsersError.BadRequest('User is already your friend', ['alreadyFriends']);
    }
    if (ourUserFriends.invitations.includes(user.id) === false)  {
      throw UsersError.BadRequest('You were not invited to friends', ['notInvited']);
    }
    const userFriends = await UserFriends.findById(user.id);
    ourUserFriends.invitations = ourUserFriends.invitations.filter((userId) => userId.toString() !== user.id);
    userFriends.invited = userFriends.invited.filter((userId) => userId.toString() !== ourId);
    await ourUserFriends.save();
    await userFriends.save();
    return new UserDto(user, user.imageId);
  }

  async removeFriend(ourId, userId) {
    const ourUserFriends = await UserFriends.findById(ourId);
    const user = await User.findById(userId).populate('imageId');
    if (!user) {
      throw UsersError.NotFound();
    }
    if (ourUserFriends.friends.includes(user.id) === false) {
      throw UsersError.BadRequest('User is not your friend', ['notFriends']);
    }
    const userFriends = await UserFriends.findById(user.id);
    ourUserFriends.friends = ourUserFriends.friends.filter((userId) => userId.toString() !== user.id);
    userFriends.friends = userFriends.friends.filter((userId) => userId.toString() !== ourId);
    await ourUserFriends.save();
    await userFriends.save();
    return new UserDto(user, user.imageId);
  }

  async getUserFriends(username) {
    const user = await User.findOne({username});
    console.log('Username: ', username);
    if (!user) {
      throw UsersError.NotFound();
    }
    const userFriends = await UserFriends.findById(user.id).populate({
      path: 'friends',
      populate: {
        path: 'imageId'
      }
    });
    console.log();
    return userFriends.friends.map(friend => {
      return new UserDto(friend, friend.imageId)
    });
  }

}

export default new UsersFriendsService();