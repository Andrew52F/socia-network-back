import express from 'express';
import { check } from 'express-validator';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import rolesMiddleware from '../middlewares/rolesMiddleware.js';

const router = express.Router();

router.post('/login', AuthController.login)

router.post('/registration', [
  check('username', 'Username field is required').notEmpty(),
  check('password', 'Password field is required').notEmpty(),
  check('username', 'Username length has to be from 6 to 15 letters').isLength({min: 6, max: 15}),
  check('password', 'Password length has to be from 4 to 10 letters').isLength({min: 4, max: 10}),
], AuthController.registration)

router.get('/users', rolesMiddleware(['ADMIN']), AuthController.getUsers)


export default router;