const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { generateTokens } = require("../../auth-common/generateToken");
const transporter = require("../../auth-common/email");
const generateResetToken = require("../../auth-common/resetToken");

module.exports.SignUp = async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already exists with this email !" });
  }
  const newUser = await User.create({
    name,
    email,
    password,
    address,
    phone,
  });
  return res.json({ message: "User created successfully !", newUser });
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials !" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials !" });
    }

    const payload = { id: user._id, email: user.email, role: "user" };
    const { accessToken, refreshToken } = generateTokens(payload);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User Logged In !",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};


module.exports.Logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const refreshToken = req.cookies?.refreshToken;
    // console.log(refreshToken);

    await User.findByIdAndUpdate(userId, { refreshToken: null });

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

    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        message: "user not found!",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.json({
      message: "user account deleted successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Account deletion failed" });
  }
};

module.exports.getProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findOne({ _id: id }).select(
      "-password -refreshtoken"
    );
    if (!user) {
      return res.json({ message: "user not found with this id !" });
    }

    return res.json({ message: "user fetched successfully!", user });
  } catch (error) {
    return res.json(error.message);
  }
};
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { resetToken, hashedToken, expiresAt } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();
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

    if (!newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Both password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    // console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // yaha direct newPassword assign karna hai
    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports.UpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;
    // console.log(req.body);

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found!" });
    }

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (phone) updatedFields.phone = phone;
    if (address) {
      updatedFields.address = {
        street: address.street || user.address.street,
        city: address.city || user.address.city,
        state: address.state || user.address.state,
        zip: address.zip || user.address.zip,
        country: address.country || user.address.country,
      };
    }

    await User.updateOne({ _id: userId }, { $set: updatedFields });

    return res.json({
      message: "Profile updated successfully!",
      updatedData: {
        id: userId,
        name: updatedFields.name || user.name,
        phone: updatedFields.phone || user.phone,
        address: updatedFields.address || user.address,
        email: user.email, // email usually change nahi karne dete
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating profile" });
  }
};
