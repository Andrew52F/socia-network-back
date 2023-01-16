import express from "express";
import mongoose from "mongoose";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import multer from 'multer';
import cors from 'cors';
import authErrorsMiddleware from "./middlewares/authErrorsMiddleware.js";

import * as dotenv from 'dotenv';

import authRouter from './routes/authorization.js';
import postsRouter from './routes/posts.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// )

//routes
app.use('/auth', authRouter);
app.use('/posts', postsRouter)

app.get('/', (req, res) => {
  res.send('this is root route')
})

//errorMiddleware
app.use(authErrorsMiddleware);

const start = async () => {
  try {
    mongoose.connect(process.env.DB_URL, () => {
      console.log('connected to DB')
    });
    app.listen(PORT, () => {console.log(`Server is running: http://localhost:${PORT}`)})
  }catch (error) {
    console.log(error)
  }
}



start();