import postsService from "../../services/postsService.js";
import { io, connectedUsers } from '../../index.js'

const data = {};

const getSocketsByPostId = (postId) => {
  const sockets = Object.keys(data).reduce((acc, socketId) => {
    if (data[socketId].includes(postId)) {
      acc.push(socketId);
    }
    return acc;
  }, [])
  return sockets;
}

const postsController = (socket) => {


  socket.on('trackPosts', async (postIds) => {
    const userId = socket.handshake.query.userId;
    data[socket.id] = postIds;
    console.log('DATA: ', JSON.stringify(data))
    socket.emit('trackPosts', 'Track!!!');


    socket.on('disconnect', () => {
      delete data[socket.id];
    })
  })

  socket.on('ratePost', async ({ourId, postId, type}) => {
    try {

      const post = await postsService.ratePost(ourId, postId, type);

      updateRate({id: post.id, likeCount: post.likeCount, dislikeCount: post.dislikeCount})
      socket.emit('ratePost', {id: post.id, rated: post.rated, likeCount: post.likeCount, dislikeCount: post.dislikeCount});


    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })

  socket.on( 'updatePost', async ({ourId, postId, data}) => {
    try {
      console.log('Inside Socket ', ourId, postId, data)
      const post = await postsService.updatePost(ourId, data, postId)

      updatePost({id: post.id, text: post.text, image: post.image})
      socket.emit('updatePost', {id: post.id, text: post.text, image: post.image})
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })
  socket.on( 'removePost', async ({ourId, postId}) => {
    try {
       await postsService.removePost(ourId, postId);

      removePost(postId)
      socket.emit('removePost', postId)
    }
    catch (error) {
      console.error(error);
      socket.emit('error', error.message);
    }
  })
}



// export const createNotification = async (userId, type, data, someoneId) => {
//   try {
//     const notification = await notificationsService.add(userId, type, data, someoneId);
//     // Отправляем уведомление пользователю через Socket.io
//     if (connectedUsers[userId]) {
//       io.to(connectedUsers[userId]).emit('newNotification', notification);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }


export const updateRate = async (postUpdates) => {
  try {
    const sockets = getSocketsByPostId(postUpdates.id);
    console.log('SOCKET IDS: ', sockets);
    sockets.forEach(socketId => {
      io.to(socketId).emit('ratePost', postUpdates);
    });
  } catch (error) {
    console.log(error);
  }
}

export const updatePost = async (postUpdates) => {
  try {
    const sockets = getSocketsByPostId(postUpdates.id);
    console.log('SOCKET IDS: ', sockets);
    sockets.forEach(socketId => {
      io.to(socketId).emit('updatePost', postUpdates);
    });
  } catch (error) {
    console.log(error);
  }
}

export const removePost = async (postId) => {
  try {
    const sockets = getSocketsByPostId(postId);
    console.log('SOCKET IDS: ', sockets);
    sockets.forEach(socketId => {
      io.to(socketId).emit('removePost', postId);
    });
  } catch (error) {
    console.log(error);
  }
}






export default postsController;

