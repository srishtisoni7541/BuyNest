const jwt=require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "accesssecret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecret";
module.exports.generateTokens = (userOrAdmin) => {

  const accessToken = jwt.sign(userOrAdmin, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(userOrAdmin, REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};
