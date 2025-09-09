const express = require('express');
const { SignUp, Login, getProfile, forgotPassword, resetPassword, Logout, DeleteAccount, UpdateProfile } = require('../controllers/user.controller');
const router = express.Router();
const verifyUser = require('../middleware/user.middleware');
router.post('/register',SignUp);
router.post('/login',Login);
router.get("/profile", verifyUser, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", verifyUser, Logout);
router.post("/delete-account", verifyUser, DeleteAccount);
router.post("/update-profile", verifyUser, UpdateProfile);


module.exports = router;