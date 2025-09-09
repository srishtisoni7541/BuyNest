const adminModel = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../../auth-common/generateToken");
const generateResetToken = require("../../auth-common/resetToken");
const transporter =require('../../auth-common/email');
const crypto = require("crypto");

module.exports.Register = async (req, res) => {
  const { name, email, password } = req.body;
  const admin = await adminModel.findOne({ email });
  if (admin) {
    return res.json({
      message: "admin already exists with this mail",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await adminModel.create({
    name,
    password: hashedPassword,
    email,
  });
  return res.json({
    message: "admin created successfully !",
    newAdmin,
  });
};

module.exports.Login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(password);
  const admin = await adminModel.findOne({ email }).select("+password");
  // console.log(admin);
  if (!admin) {
    return res.json({ message: "Invalid Credentials !" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  // console.log(isMatch);
  if (!isMatch) {
    return res.json({ message: "Invalid Credentials !" });
  }

  const payload = { id: admin._id, email: admin.email, role: "admin" };
  const { accessToken, refreshToken } = generateTokens(payload);

  admin.refreshToken = refreshToken;
  await admin.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: "Admin Logged In !",
    accessToken,
    admin: {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    },
  });
};

module.exports.Logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const refreshToken = req.cookies?.refreshToken;
    // console.log(refreshToken);

    await adminModel.findByIdAndUpdate(userId, { refreshToken: null });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports.DeleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const admin = await adminModel.findById(userId);
    if (!admin) {
      return res.json({
        message: "Admin not found!",
      });
    }

    await adminModel.findByIdAndDelete(userId);

    return res.json({
      message: "Admin account deleted successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Account deletion failed" });
  }
};

module.exports.getProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const admin = await adminModel
      .findOne({ _id: id })
      .select("-password -refreshtoken");
    if (!admin) {
      return res.json({ message: "admin not found with this id !" });
    }

    return res.json({ message: "admin fetched successfully!", admin });
  } catch (error) {
    return res.json(error.message);
  }
};
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const admin = await adminModel.findOne({ email });
    if (!admin) return res.status(404).json({ message: "User not found" });

    const { resetToken, hashedToken, expiresAt } = generateResetToken();
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = expiresAt;
    await admin.save();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"E-commerce Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Reset Your Password</h3>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetURL}" target="_blank">${resetURL}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    // console.log(req.body);

    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Both password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await adminModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


module.exports.UpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    // check if admin exists
    const admin = await adminModel.findById(userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // update only name
    await adminModel.updateOne({ _id: userId }, { $set: { name: name } });

    return res.json({
      message: "Profile updated successfully!",
      updatedData: { id: userId, name, email: admin.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating profile" });
  }
};
