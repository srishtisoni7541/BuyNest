const express = require("express");
const {
  Register,
  Login,
  Logout,
  DeleteAccount,
  getProfile,
  forgotPassword,
  resetPassword,
  UpdateProfile,
} = require("../controllers/admin.controller");
const verifyAdmin = require("../middleware/admin.middleware");
const passport = require("../../auth-common/googleAuth");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const { tokens, admin } = req.user;

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(
      `${process.env.FRONTEND_ADMIN_URL}/google-success?accessToken=${tokens.accessToken}&name=${admin.name}&email=${admin.email}`
    );
  }
);
router.post("/register", Register);
router.post("/login", Login);
// router.post("/refresh-token", refreshToken);
router.get("/profile", verifyAdmin, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", verifyAdmin, Logout);
router.post("/delete-account", verifyAdmin, DeleteAccount);
router.post("/update-profile", verifyAdmin, UpdateProfile);

module.exports = router;
