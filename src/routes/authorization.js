import express from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import rolesMiddleware from '../middlewares/rolesMiddleware.js';

const router = express.Router();

router.post('/registration', 
  body('email', 'Incorrect email').isEmail(),
  body('password', 'Password length has to be from 4 to 30 letters').isLength({min:4, max: 30}),
  AuthController.registration
)

router.post('/login', AuthController.login)

router.post('/logout', AuthController.logout);

router.get('/activate/:link', AuthController.activate);

router.get('/refresh', AuthController.refresh);

router.get('/users', rolesMiddleware(['ADMIN']), AuthController.getUsers)


export default router;