import jsonwebtoken from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

class TokenService {
  generateTokens( payload ) {
    const accessToken = jsonwebtoken.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
    const refreshToken = jsonwebtoken.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
    return {accessToken, refreshToken}
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await RefreshToken.findOne({user: userId});

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await RefreshToken.create({user: userId, refreshToken})
  }
}
export default new TokenService();