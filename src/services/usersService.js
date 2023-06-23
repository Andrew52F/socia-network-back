import User from "../models/User.js";
import UsersError from "../exceptions/usersError.js";
import ProfileUserDto from "../dtos/ProfileUserDto.js";
import UserDto from "../dtos/UserDto.js";
import AuthUserService from "./AuthUserService.js";
import Image from "../models/Image.js";
import imagesService from "./imagesService.js";
import UserFriends from "../models/UserFriends.js";


class UsersService {

  async createNew(userId, userData) {
    const user = await User.findById(userId);
    if (user) {
      throw UsersError.BadRequest('Profile is already created')
    }

    if (userData.image) {
      const newImage = await imagesService.add(userData.image, 'user');
      console.log('USERS IMAGE: ', newImage);
      userData.image = newImage.id;
      console.log('DATA IMAGE: ', userData.image);
    }

    const newUser = new User({
      _id: userId,
      username: userData.username,
      name: userData.name,
      surname: userData.surname,
      isMale: userData.isMale,
      birthDate: userData.birthDate,
      imageId: userData.image
    })
    console.log('NEW USER: ', newUser);
    await newUser.save();
    console.log('AFTER SAVE')

    const usersFriends = new UserFriends({_id: newUser.id});
    await usersFriends.save();

    if (newUser.imageId) {
      const image = await imagesService.getImage(newUser.imageId);
      const newUserData = new UserDto(newUser, image);
      newUserData.id = newUser.id;
      return newUserData;
    }

    const newUserData = new UserDto(newUser);
    newUserData.id = newUser.id;
    return newUserData;
  }

  async getUsers () {
    const users = await User.find();
    return users.map(async user => {

      if (user.imageId) {
        const image = await imagesService.getImage(user.imageId);
        return new UserDto(user, image);
      }

      return new UserDto(user)
    });
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw UsersError.NotFound();
    }
    if (user.imageId) {
      const image = await imagesService.getImage(user.imageId);
      return new UserDto(user, image);
    }

    return new UserDto(user)

  }

  async getUser(username) {
    const user = await User.findOne({username});
    if (!user) {
      throw UsersError.NotFound();
    }
    if (user.imageId) {
      const image = await imagesService.getImage(user.imageId);
      return new UserDto(user, image);
    }

    return new UserDto(user)

  }

  async getUserProfile(username) {
    const user = await User.findOne({username});
    if (!user) {
      throw UsersError.NotFound();
    }
    if (user.imageId) {
      const image = await imagesService.getImage(user.imageId);
      return new ProfileUserDto(user, image);
    }
    
    return new ProfileUserDto(user)
  }

  // async getUserFriends(username) {
  //   const user = await User.findOne({username}).populate('friends');;
  //   if (!user) {
  //     throw UsersError.NotFound();
  //   }
  //   return user.friends;
  // }
  // async addUserFriends(ourId, username) {
  //   const ourUser = await User.findById(ourId);
  //   const secondUser = await User.findOne({username});
  //   if (!secondUser) {
  //     throw UsersError.NotFound();
  //   }
  //   ourUser.friends.pu
  // }

  async updateUser(username, userData, ourId) {
    const user = await User.findById(userId);
    if (!user) {
      throw UsersError.NotFound();
    }
    if (userId !== ourId) {
      throw UsersError.IsForbidden();
    }

    if (userData.image) {
      const image = await imagesService.updateImage(userData.image, 'user', user.imageId)
    }

    // console.log('userData: ', userData);
    for (let key in userData) {
      if (key === 'image') { continue }
      // console.log(`UPDATE: ${key} to ${userData[key]}`)
      user[key] = userData[key];
    };
    await user.save()

    return new ProfileUserDto(user);

  }

}

export default new UsersService();