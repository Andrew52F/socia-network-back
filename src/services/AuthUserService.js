import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import mailService from '../services/mailService.js';

import AuthError from '../exceptions/authError.js';

import AuthUser from "../models/AuthUser.js";
import Role from "../models/Role.js";

import TokenService from '../services/TokenService.js';

import UserDto from '../dtos/userDto.js';


class AuthUserService {
  async registration(email, password) {

    const candidate = await AuthUser.findOne({email});
    if (candidate) {
      if (candidate) {
        throw AuthError.BadRequest(`User with ${email} already exists`);
      }
    }

    const hashPassword = bcrypt.hashSync(password, 7);
    const activationLink = v4();
    const userRole = await Role.findOne({value: 'USER'})
  
    const user = new AuthUser({email, password: hashPassword, activationLink, roles: [userRole.value]})
    await user.save();

    await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({...userDto});
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await AuthUser.findOne({email});
    if (!user) {
      throw AuthError.BadRequest(`User with email ${email} is not found`)
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      throw AuthError.BadRequest('Password is not valid');
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({...userDto});
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
  
  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }
  
  async activate(activationLink) {
    const user = await AuthUser.findOne({activationLink: activationLink});
    if (!user) {
      throw AuthError.BadRequest('ActivationLink is not valid')
    }

    user.isActivated = true;
    await user.save();
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw AuthError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const refreshTokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !refreshTokenFromDb) {
      throw AuthError.UnauthorizedError();
    }

    const user = await AuthUser.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({...userDto});
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }


  async getAllUsers() {
    const users = await AuthUser.find();
    return users;
  }


}

export default new AuthUserService();