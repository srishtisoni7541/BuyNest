

const adminModel = require("../models/admin.model");
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require("../../auth-common/verifyToken");
const jwt = require("jsonwebtoken");

module.exports = async function verifyAdmin(req, res, next) {
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

      const admin = await adminModel.findOne({
        _id: refreshDecoded.id,
        refreshToken,
      });
      if (!admin) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Refresh token mismatch" });
      }

      const payload = { id: admin._id, email: admin.email, role: "admin" };
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

    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized: Admin not found" });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
