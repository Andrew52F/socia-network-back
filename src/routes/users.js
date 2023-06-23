import express from 'express';
import { body } from 'express-validator';
import UsersController from '../controllers/UsersController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


//create new User
router.post('/', [authMiddleware], UsersController.createNew); // Y

//get Users
router.get('/list', [], UsersController.getUsers);

//get Our notifications
router.get('/notifications', [], UsersController.getNotifications);

//get User by username
router.get('/:username', [], UsersController.getUser);

//get User profile by username
router.get('/:username/profile', [], UsersController.getUserProfile);


// router.get('/:username/pages', [], UsersController.getUserPages);

// router.get('/:username/persecutedUsers', [], UsersController.getUserPersecutedUsers);

// //get Our profile
// router.get('/profile', [], UsersController.getProfile);


// update User by username
// router.patch('/:username', [], UsersController.updateUser);


export default router;