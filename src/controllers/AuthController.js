import { validationResult } from 'express-validator';
import AuthUserService from '../services/AuthUserService.js';
import AuthError from '../exceptions/authError.js';
import Role from "../models/Role.js";


class AuthController {

  async registration ( req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(AuthError.BadRequest('Validation error', errors))
      }

      const { email, password } = req.body;
      const authUserData = await AuthUserService.registration(email, password);

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

      const authUserData = await AuthUserService.login(email, password);

      res.cookie('refreshToken', authUserData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(authUserData);

    }
    catch ( error ) {
      next(error)
    }
  }


  async logout (req, res, next)  {
    try {

    }
    catch(error) {
      next(error)
    }
  }

  async activate (req, res, next)  {
    try {
      const activationLink = req.params.link;
      await AuthUserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    }
    catch(error) {
      next(error)
    }
  }

  async refresh (req, res, next)  {
    try {

    }
    catch(error) {
      next(error)
    }
  }



  async getUsers ( req, res ) {
    try {
      const users = await User.find();

      res.json(users);
    }
    catch (error) {
      next(error)
    }
  }
}

export default new AuthController;