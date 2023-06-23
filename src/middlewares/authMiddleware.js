import AuthError from "../exceptions/authError.js";
import UserError from "../exceptions/usersError.js";
import tokenService from "../services/tokenService.js";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log('NO HEADER')
      return next(AuthError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      console.log('NO ACCESS TOKEN')
      return next(AuthError.UnauthorizedError());
    }
    const decodedData = tokenService.validateAccessToken(accessToken);
    if (!decodedData) {
      console.log('NO DECODED DATA: ', decodedData)
      return next(AuthError.UnauthorizedError());
    }
    if (!decodedData.isActivated) {
      console.log('NOT ACTIVATED')
      return next(AuthError.NotActivated());
    }
    // const user = await User.findOne({user: decodedData.id});
    // if (!user) {
    //   console.log('NO USER PROFILE')
    //   return next(UserError.NotFound())
    // }


    req.authUser = decodedData;

    console.log('AUTHORIZED USER: ', decodedData)
    next();
  }
  catch (error) {
    return next(AuthError.UnauthorizedError());
  }


}
export default authMiddleware;