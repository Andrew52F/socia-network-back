import jsonwebtoken from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).json({message: 'User is not authorized'})
    }
    const decodedData = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  }
  catch (error) {
    console.log(error);
    return res.status(403).json({message: 'User is not authorized'})
  }


}
export default authMiddleware;