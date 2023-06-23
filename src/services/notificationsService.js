import User from "../models/User.js";
import UsersError from "../exceptions/usersError.js";
import ProfileUserDto from "../dtos/ProfileUserDto.js";
import UserDto from "../dtos/UserDto.js";
import AuthUserService from "./authUserService.js";
import Image from "../models/Image.js";
import imagesService from "./imagesService.js";
import UserFriends from "../models/UserFriends.js";
import Notification from "../models/Notification.js";
import NotificationDto from "../dtos/NotificationDto.js";

const types = ['invite', 'notice'];

class NotificationsService {
  async add(userId, type,  data, someoneId) {
    const user = await User.findById(userId);
    if (!user) {
      throw UsersError.NotFound();
    }
    if (types.includes(type) === false) {
      throw UsersError.BadRequest(`Type has to be one of the following values: ${types}`)
    }

      let someone;

      if (someoneId) {
        const someUser = await User.findById(someoneId).populate('imageId');
        if (!someUser) {
          throw UsersError.NotFound();
        }
        someone =  someUser;
      }

      
      const notification = new Notification({
        userId: user.id,
        type,
        data,
        someoneId: someone.id,
      })
      await notification.save()

      const someoneImage = someone.imageId || false;
      return new NotificationDto(notification, {someone, someoneImage}); 
  }

  async remove(id) {
    const notification = await Notification.findById(id).populate({
      path: 'someoneId',
      populate: {
        path: 'imageId'
      }
    });
    await Notification.findByIdAndDelete(id);

    const someone = notification.someoneId || false;
    const someoneImage = someone.imageId || false;

    return new NotificationDto(notification, {someone, someoneImage});
  }

  async getAllNotifications(userId) {
    const user = await User.findById(userId)

    if (!user) {
      throw UsersError.NotFound();
    }
    const notificationsData = await Notification.find({userId: user.id}).populate({
      path: 'someoneId',
      populate: {
        path: 'imageId'
      }
    });

    console.log('Notifications Data: ', notificationsData)
    const notifications = notificationsData.map(notificationData => {
      const someone = notificationData.someoneId || false;
      const someoneImage = someone.imageId || false;

      return new NotificationDto(notificationData, {
        someone, someoneImage
      })
    })
    console.log('Notifications: ', notifications)
    return notifications;
  }

}

export default new NotificationsService();