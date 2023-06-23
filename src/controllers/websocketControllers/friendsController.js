import usersFriendsService from "../../services/usersFriendsService.js";
import { createNotification, removeNotification } from './notificationsController.js';
import usersService from "../../services/usersService.js";
import { io, connectedUsers } from "../../index.js";


const friendsController = (socket) => {

  socket.on('getFriends', async (username) => {
    try {
      const friends = await usersFriendsService.getUserFriends(username);
      socket.emit('getFriends', friends);
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })

  socket.on('inviteFriend', async ({ourId, userId}) => {
    try {
      const user = await usersFriendsService.inviteFriend(ourId, userId);
      
      createNotification(userId, 'invite', {  // notification to receiver
        text: 'Someone sent you a friend invite',
        code: 'receiverFriendshipInvited',
      }, ourId)

      createNotification(ourId, 'notice', { // notification to sender
        text: ' You sent someone a friend invite',
        code: 'senderFriendshipInvited',
      }, userId);

    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })

  socket.on('acceptFriend', async ({ourId, userId, notificationId}) => {
    try {
      const friend = await usersFriendsService.acceptFriend(ourId, userId);
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

      socket.emit('acceptFriend', friend);
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })
  
  socket.on('declineFriend', async ({ourId, userId, notificationId}) => {
    try {
      const user = await usersFriendsService.declineFriend(ourId, userId);

      createNotification(userId, 'notice', {  // notification to receiver
        text: 'Someone is declined your friendship invitation',
        code: 'receiverFriendshipDeclined',
      }, ourId)
      removeNotification(ourId, notificationId)

      // socket.emit('declineFriend', user);
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })


  socket.on('removeFriend', async ({ourId, userId}) => {
    try {
      const user = await usersFriendsService.removeFriend(ourId, userId);
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


      socket.emit('removeFriend', user);
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })

} 

export const acceptFriendSocket = async (userId, friend) => {
  try {

    if (connectedUsers[userId]) {
      io.to(connectedUsers[userId]).emit('acceptFriend', friend);
    }
  } catch (error) {
    console.log(error);
  }
}
export const removeFriendSocket = async (userId, user) => {
  try {
   
    if (connectedUsers[userId]) {
      io.to(connectedUsers[userId]).emit('removeFriend', user);
    }
  } catch (error) {
    console.log(error);
  }
}

export default friendsController;