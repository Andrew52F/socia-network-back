import jsonwebtoken from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

class TokenService {
  generateTokens( payload ) {
    const accessToken = jsonwebtoken.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
    const refreshToken = jsonwebtoken.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {accessToken, refreshToken}
  }

  validateAccessToken(token) {
    try {
      const userData = jsonwebtoken.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    }
    catch (error) {
      console.log('VALIDATE ACCESS ERROR ', error)
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jsonwebtoken.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    }
    catch (error) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await RefreshToken.findById(userId);

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await RefreshToken.create({_id: userId, refreshToken})
  }

  async findToken(refreshToken) {
    const tokenData = await RefreshToken.findOne({refreshToken});
    return tokenData;
  }

  async removeToken(refreshToken) {
    const tokenData = await RefreshToken.deleteOne({refreshToken});
    return tokenData;
  }
}
export default new TokenService();