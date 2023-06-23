import AuthError from '../exceptions/authError.js';
import UsersError from '../exceptions/usersError.js';

export default (error, req, res, next) => {
  console.log(error)
  if(error instanceof AuthError) {
    return res.status(error.status).json({message: error.message, errors: error.errors})
  }
  if(error instanceof UsersError) {
    return res.status(error.status).json({message: error.message, errors: error.errors})
  }

  
  return res.status(500).json({message: 'Unexpected error'})
}