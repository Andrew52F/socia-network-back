import express from 'express';
import { body } from 'express-validator';
import UsersController from '../controllers/UsersController.js';
import FriendsController from '../controllers/FriendsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
// get list of users friends
router.get('/list/:username', [], FriendsController.getUserFriends);
// invite user 
router.post('/invite', [], FriendsController.inviteFriend);
// accept users invite
router.post('/accept', [], FriendsController.acceptFriend);
// decline users invite
router.post('/decline', [], FriendsController.declineFriend);
// remove user from friends
router.delete('/remove', [], FriendsController.removeFriend);



export default router;