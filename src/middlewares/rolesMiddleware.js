import jsonwebtoken from "jsonwebtoken";

const rolesMiddleware = (roles) => (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({message: 'User is not authorized'})
    }
    const { roles: userRoles} = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let hasRole = false;
    console.log(roles, userRoles)
    console.log(roles.includes(userRoles[0]))
    userRoles.forEach(role => {
      if (roles.includes(role)) {
        hasRole = true;
      }
    });
    if (!hasRole) {
      return res.status(403).json({message: 'Access denied'})
    }
    next();
  }
  catch (error) {
    console.log(error);
    return res.status(403).json({message: 'User is not authorized'})
  }


}
export default rolesMiddleware;