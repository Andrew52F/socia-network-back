import express from "express";

import mongoose from "mongoose";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import errorsMiddleware from "./middlewares/errorsMiddleware.js";

import * as dotenv from 'dotenv';

import notificationsController from "./controllers/websocketControllers/notificationsController.js";
import friendsController from "./controllers/websocketControllers/friendsController.js";

import authRouter from './routes/authorization.js';
import usersRouter from './routes/users.js'
import friendsRouter from './routes/friends.js';
import postsRouter from './routes/posts.js';

import authMiddleware from "./middlewares/authMiddleware.js";

import http from 'http';
import { Server } from 'socket.io';
import postsController from "./controllers/websocketControllers/postsController.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// )

//Routes
app.use('/auth', authRouter);
app.use('/users', [authMiddleware], usersRouter)
app.use('/friends', [authMiddleware], friendsRouter)
app.use('/posts', [authMiddleware], postsRouter)

app.get('/', (req, res) => {
  res.send('this is root route')
})

//errorMiddleware
app.use(errorsMiddleware);

// Socket.IO
export const connectedUsers = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`New user connected: ${socket.id}, userId: ${userId}`);
  connectedUsers[userId] = socket.id;
  console.log(`Connected users: ${JSON.stringify(connectedUsers)}`);

  // socket controllers
  notificationsController(socket);
  friendsController(socket);
  postsController(socket);
  
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}, userId: ${userId}`);
    delete connectedUsers[userId];
    console.log(`Connected users: ${connectedUsers}`);
  });
});

// export async function createNotification(userId, type, data, senderId = null) {
//   try {
//     await notificationsService.add(userId, type, data, senderId);
//     // Отправляем уведомление пользователю через Socket.io
//     io.to(userId).emit('newNotification', { type, data });
//   } catch (error) {
//     console.log(error);
//   }
// }

const start = async () => {
  try {
    mongoose.connect(process.env.DB_URL, () => {
      console.log('connected to DB')
    });
    server.listen(PORT, () => {
      console.log(`Server is running: http://localhost:${PORT}`);
    });
    // app.listen(PORT, () => {console.log(`Server is running: http://localhost:${PORT}`)})
  }catch (error) {
    console.log(error)
  }
}

start();