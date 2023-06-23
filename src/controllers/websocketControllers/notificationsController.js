import notificationsService from "../../services/notificationsService.js";
import { io, connectedUsers } from '../../index.js'

const notificationsController = (socket) => {


  socket.on('getNotifications', async (userId) => {
    try {
      const notifications = await notificationsService.getAllNotifications(userId);
      console.log('NOTifications: ', notifications)
      socket.emit('getNotifications', notifications);
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })

  socket.on('removeNotification', async (id) => {
    try {
      const notification = await notificationsService.remove(id);
      socket.emit('removeNotification', notification);
    }
    catch ( error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })

  // socket.on('createNotification', async ({userId, type, data, senderId}) => {
  //   try {
  //     const notification = await notificationsService.add(userId, type, data, senderId);
  //     socket.emit('NotificationAdd', notification);
  //   }
  //   catch(error) {
  //     console.log(error);
  //     socket.emit('error', error, message);
  //   }
  // })
}

export const createNotification = async (userId, type, data, someoneId) => {
  try {
    const notification = await notificationsService.add(userId, type, data, someoneId);
    // Отправляем уведомление пользователю через Socket.io
    if (connectedUsers[userId]) {
      io.to(connectedUsers[userId]).emit('newNotification', notification);
    }
  } catch (error) {
    console.log(error);
  }
}
export const removeNotification = async (userId, id) => {
  try {
     await notificationsService.remove(id);
    if (connectedUsers[userId]) {
      io.to(connectedUsers[userId]).emit('removeNotification', id);
    }
  } catch (error) {
    console.log(error);
  }
}



export default notificationsController;

