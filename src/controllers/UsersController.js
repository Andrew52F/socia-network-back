import { validationResult } from 'express-validator';
import UsersError from '../exceptions/usersError.js';
import usersService from '../services/usersService.js';
import usersFriendsService from '../services/usersFriendsService.js';
import imagesService from '../services/imagesService.js';
import notificationsService from '../services/notificationsService.js';


class UsersController {

  async createNew ( req, res, next) {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(UsersError.BadRequest('Validation error', errors))
      }
      const userId = req.authUser.id;
      const userData = req.body;
      if (!userData.image) {
        userData.image = undefined;
      }
      console.log('User data: ', userData)

      const user = await usersService.createNew(userId, userData);
      
      return res.json(user);
    }
    catch ( error ) {
      next(error)
    }
  }

  async getUsers ( req, res, next) {
    try {

      const users = await usersService.getUsers();
      return res.json(users);

    }
    catch ( error ) {
      next(error)
    }
  }


  async getUser (req, res, next)  {
    try {
      const username = req.params.username;

      const user = await usersService.getUser(username);
      return res.json(user);
    }
    catch(error) {
      next(error)
    }
  }

  async getUserProfile (req, res, next) {
    try {
      const username = req.params.username;
      const user = await usersService.getUserProfile(username);
      return res.json(user);
    }
    catch (error) {
      next(error)
    }
  }
  async getNotifications (req, res, next) {
    try {
      const ourId = req.authUser.id;
      const notifications = await notificationsService.getAllNotifications(ourId)
      return res.json(notifications);
    }
    catch (error) {
      next(error)
    }
  }


  async updateUser (req, res, next)  {
    try {
      const username = req.params.username;
      const userId = req.authUser.id;
      const userData = req.body;

      const user = await usersService.updateUser(username, userData , userId);
      return res.json(user);
    }
    catch(error) {
      next(error)
    }
  }

  
  
  // async getUserPages ( req, res, next) {
  //   try {
  //     const username = req.body.username;
  //     const pages = await usersService.getUserPages(username);

  //   }
  //   catch (error) {
  //     next(error)
  //   }
  // }

  // async getUserPersecutedUsers( req, res, next) {
  //   try {
  //     const username = req.body.username;
  //     const persecutedUsers = await usersService.getPersecutedUsers(username);

  //   }
  //   catch (error) {
  //     next(error)
  //   }
  // }

}


export default new UsersController;