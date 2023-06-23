import { validationResult } from 'express-validator';
import UsersError from '../exceptions/usersError.js';
import usersService from '../services/usersService.js';
import usersFriendsService from '../services/usersFriendsService.js';
import notificationsService from '../services/notificationsService.js';
import imagesService from '../services/imagesService.js';
import { createNotification, removeNotification } from './websocketControllers/notificationsController.js';
import { removeFriendSocket } from './websocketControllers/friendsController.js';


class FriendsController {
  async getUserFriends ( req, res, next) {
    try {
      const username = req.params.username;
      const friends = await usersFriendsService.getUserFriends(username);
      return res.json(friends);
    }
    catch (error) {
      next(error)
    }
  }

  async inviteFriend ( req, res, next) {
    try {
      console.log('invite friends')
      const userId = req.body.id;
      const ourId = req.authUser.id;

      console.log(userId, ourId)
      const invitedUser = await usersFriendsService.inviteFriend(ourId, userId);
      
      // userId, type, data, senderId = null

      createNotification(userId, 'invite', {  // notification to receiver
        text: 'Someone sent you a friend invite',
        code: 'receiverFriendshipInvited',
      }, ourId)

      createNotification(ourId, 'notice', { // notification to sender
        text: ' You sent someone a friend invite',
        code: 'senderFriendshipInvited',
      }, userId);

      // res.json({user: invitedUser, message: 'invited'})
      }
    catch (error) {
      next(error)
    }
  }
  async acceptFriend ( req, res, next) {
    try {
      console.log('accept friends')
      const userId = req.body.id;
      const notificationId = req.body.notificationId;
      const ourId = req.authUser.id;
      const invitedUser = await usersFriendsService.acceptFriend(ourId, userId);
      const ourUser = await usersService.getUserById(ourId);

      acceptFriendSocket(userId, ourUser);

      createNotification(userId, 'notice', {  // notification to receiver
        text: 'Someone is now your friend',
        code: 'receiverFriendshipAccepted',
      }, ourId)

      createNotification(ourId, 'notice', { // notification to sender
        text: 'Someone is now your friend',
        code: 'senderFriendshipAccepted',
      }, userId)
      removeNotification(ourId, notificationId)
      return res.json({user: invitedUser, notificationId,  message: 'accepted'});
    }
    catch (error) {
      next(error)
    }
  }
  async declineFriend (req, res, next) {
    try {
      console.log('decline friends')
      const userId = req.body.id;
      const notificationId = req.body.notificationId;
      const ourId = req.authUser.id;
      console.log('AAAAAAAAAA: ', userId, notificationId, ourId)
      console.log('Boooooody: ',  req.body);
      const invitedUser = await usersFriendsService.declineFriend(ourId, userId);
      // const ourUser = await usersService.getUserById(ourId);
     

      createNotification(userId, 'notice', {  // notification to receiver
        text: 'Someone is declined your friendship invitation',
        code: 'receiverFriendshipDeclined',
      }, ourId)
      removeNotification(ourId, notificationId)


      return res.json({user: invitedUser, notificationId, message: 'declined'});
    }
    catch (error) {
      next(error)
    }
  }

  async removeFriend (req, res, next) {
    try {
      console.log('remove friends')
      const userId = req.body.id;
      console.log('userId: ', userId)
      const ourId = req.authUser.id;
      const removedUser = await usersFriendsService.removeFriend(ourId, userId);
      const ourUser = await usersService.getUserById(ourId);

      removeFriendSocket(userId, ourUser);

      createNotification(userId, 'notice', {  // notification to receiver
        text: 'Someone is no longer your friend',
        code: 'receiverFriendshipRemoved',
      }, ourId)

      createNotification(ourId, 'notice', { // notification to sender
        text: 'Someone is no longer your friend',
        code: 'senderFriendshipRemoved',
      }, userId)

      

      return res.json({user: removedUser, message: 'removed'});
    }
    catch (error) {
      next(error)
    }
  }

}


export default new FriendsController;