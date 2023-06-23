import AuthError from "../exceptions/authError.js";

const rolesMiddleware = (...roles) => (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const authUser = req.authUser;
    console.log('ROLES: ', authUser)

    // const authorizationHeader = req.headers.authorization;
    // const accessToken = authorizationHeader.split(' ')[1];
    // const decodedData = TokenService.validateAccessToken(accessToken);

    let access = false;
    authUser.roles.forEach(role => {
      if (roles.includes(role)) {
        access = true;
      }
    }) 
    if (!access) {
      return next(AuthError.IsForbidden(authUser.roles));
    }
    
    next();
  }
  catch (error) {
    console.log(error);
    return res.status(403).json({message: 'User is not authorized'})
  }


}
export default rolesMiddleware;