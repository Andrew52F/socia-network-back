import User from "../models/User.js";
import UsersError from "../exceptions/authError.js";

const userProfileMiddleware = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const authUserId = req.authUser.id;

    const user = await User.findById(authUserId)
    if (!user) {
      return next(UsersError.UnauthorizedError());
    }
    
    next();
  }
  catch (error) {
    console.log(error);
    return next(UsersError.UnauthorizedError());
  }

}
export default userProfileMiddleware;