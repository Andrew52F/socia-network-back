import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from "../models/User.js";
import Role from "../models/Role.js";

const generateAccessToken = (id, roles) => {
  const payload = {id, roles};
  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {expiresIn: '30m'})

}



class AuthController {


  async login ( req, res ) {
    try {
      const {username, password} = req.body;

      const user = await User.findOne({username});
      if (!user) {
        return res.status(400).json({message: `User ${username} is not found`})
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({message: 'Password is not valid'})
      }

      const token = generateAccessToken(user._id, user.roles);
      res.json({token})

    }
    catch ( error ) {
      console.log(error)
      res.status(400).json(error)
    }
  }


  async registration ( req, res ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'validation errors', errors});
      }


      const { username, password } = req.body;
      const candidate = await User.findOne({username});
      if (candidate) {
        return res.status(400).json({message: 'Such user already exist'})
      }

      const hashPassword = bcrypt.hashSync(password, 7)
      const userRole = await Role.findOne({value: 'USER'})

      const user = new User({username, password: hashPassword, roles: [userRole.value]})
      await user.save()
      return res.json({message: `User ${username} is successfully created`})
    }


    catch ( error ) {
      console.log(error)
      res.status(400).json(error)
    }
  }


  async getUsers ( req, res ) {
    try {
      const users = await User.find();

      res.json(users);
    }
    catch (error) {
      console.log(error)
    }
  }
}

export default new AuthController;