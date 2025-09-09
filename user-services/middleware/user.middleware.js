
const jwt = require("jsonwebtoken");
const { verifyAccessToken, verifyRefreshToken } = require("../../auth-common/verifyToken");
const User = require("../models/User");

module.exports = async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No access token" });
    }

    const accessToken = authHeader.split(" ")[1];
    let decoded = verifyAccessToken(accessToken);

    if (!decoded) {
      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Token expired, no refresh token" });
      }

      const refreshDecoded = verifyRefreshToken(refreshToken);
      if (!refreshDecoded) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      const user = await User.findOne({
        _id: refreshDecoded.id,
        refreshToken,
      });
      if (!user) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Refresh token mismatch" });
      }

      const payload = { id: user._id, email: user.email, role: "user" };
      const newAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );

      res.setHeader("x-access-token", newAccessToken);

      decoded = refreshDecoded;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
