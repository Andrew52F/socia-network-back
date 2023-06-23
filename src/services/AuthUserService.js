import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import mailService from './mailService.js';

import AuthError from '../exceptions/authError.js';

import AuthUser from "../models/AuthUser.js";
import Role from "../models/Role.js";

import tokenService from './tokenService.js';

import AuthUserDto from '../dtos/authUserDto.js';

import usersService from './usersService.js';
import ProfileUserDto from '../dtos/ProfileUserDto.js';
import imagesService from './imagesService.js';


class AuthUserService {
  async registration(email, password) {

    const candidate = await AuthUser.findOne({email});
    if (candidate) {
      if (candidate) {
        throw AuthError.BadRequest(`This email is already used`, ['usedEmail']);
      }
    }

    const hashPassword = bcrypt.hashSync(password, 7);
    const activationLink = v4();
    const userRole = await Role.findOne({value: 'USER'})
  
    const user = new AuthUser({email, password: hashPassword, activationLink, roles: [userRole.value]})
    await user.save();

    await mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);
    const authUserDto = new AuthUserDto(user);
    const tokens = tokenService.generateTokens({...authUserDto});
    await tokenService.saveToken(authUserDto.id, tokens.refreshToken);

    return { ...tokens, authUser: authUserDto };
  }

  async login(email, password) {
    const user = await AuthUser.findOne({email});
    if (!user) {
      throw AuthError.BadRequest(`User with email ${email} is not found`, ['nfEmail'])
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      throw AuthError.BadRequest('Password is not valid', ['nvPassword']);
    }

    const authUserDto = new AuthUserDto(user);
    const tokens = tokenService.generateTokens({...authUserDto});
    await tokenService.saveToken(authUserDto.id, tokens.refreshToken);

    try {
      const ourUser = await usersService.getUserById(user.id);
      ourUser.id = user.id;
      console.log('USER PROFILE: ', ourUser)
      return { ...tokens, authUser: authUserDto, user: ourUser };
    }
    catch(e) {
      return { ...tokens, authUser: authUserDto };
    }
  }
  
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
  
  async activate(activationLink) {
    const user = await AuthUser.findOne({activationLink: activationLink});
    if (!user) {
      throw AuthError.BadRequest('ActivationLink is not valid', ['nvActivationLink'])
    }

    user.isActivated = true;
    await user.save();
  }
  
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw AuthError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const refreshTokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !refreshTokenFromDb) {
      throw AuthError.UnauthorizedError();
    }

    const user = await AuthUser.findById(userData.id);
    const authUserDto = new AuthUserDto(user);
    const tokens = tokenService.generateTokens({...authUserDto});
    await tokenService.saveToken(authUserDto.id, tokens.refreshToken);

    try {
      const ourUser = await usersService.getUserById(user.id);
      ourUser.id = user.id;
      console.log('USER PROFILE: ', ourUser)
      return { ...tokens, authUser: authUserDto, user: ourUser };
    }
    catch(e) {
      return { ...tokens, authUser: authUserDto };
    }
  }

  async getAuthUser (authUserInfo) {
    const authUser = await AuthUser.findOne(authUserInfo)
    if (!authUser) {
      throw AuthError.BadRequest(`User is not found`)
    }
    return authUser;
  }

  async getAllUsers() {
    const users = await AuthUser.find();
    return users;
  }


}

export default new AuthUserService();