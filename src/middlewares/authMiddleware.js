import jsonwebtoken from "jsonwebtoken";
import AuthError from "../exceptions/authError.js";
import TokenService from "../services/TokenService.js";

const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(AuthError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(AuthError.UnauthorizedError());
    }
    const decodedData = TokenService.validateAccessToken(accessToken);
    if (!decodedData) {
      return next(AuthError.UnauthorizedError());
    }

    req.user = decodedData;
    next();
  }
  catch (error) {
    return next(AuthError.UnauthorizedError());
  }


}
export default authMiddleware;