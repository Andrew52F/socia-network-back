import { validationResult } from 'express-validator';
import authUserService from '../services/authUserService.js';
import AuthError from '../exceptions/authError.js';
import usersFriendsService from '../services/usersFriendsService.js';


class AuthController {

  async registration ( req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(AuthError.BadRequest('Validation error', errors))
      }

      const { email, password } = req.body;
      const authUserData = await authUserService.registration(email, password);

      //check if user is created
      // const isProfileCreated = Boolean( await userService.findByAuthId(authUserData.authUser.id) );
      // authUserData.isProfileCreated = isProfileCreated;

      res.cookie('refreshToken', authUserData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(authUserData);
    }
    catch ( error ) {
      next(error)
    }
  }

  async login ( req, res, next) {
    try {
      const {email, password} = req.body;
      const authUserData = await authUserService.login(email, password);
      res.cookie('refreshToken', authUserData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

      return res.json(authUserData);
      
    }
    catch ( error ) {
      next(error)
    }
  }


  async logout (req, res, next)  {
    try {
      const { refreshToken } = req.cookies;
      const token = await authUserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    }
    catch(error) {
      next(error)
    }
  }

  async activate (req, res, next)  {
    try {
      const activationLink = req.params.link;
      await authUserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    }
    catch(error) {
      next(error)
    }
  }

  async refresh (req, res, next)  {
    try {
      const { refreshToken } = req.cookies;
      const authUserData = await authUserService.refresh(refreshToken);
      res.cookie('refreshToken', authUserData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});

      return res.json(authUserData);
    }
    catch(error) {
      next(error)
    }
  }

  async getUsers ( req, res ) {
    try {
      const users = await authUserService.getAllUsers();
      return res.json(users);
    }
    catch (error) {
      next(error)
    }
  }
}

export default new AuthController;