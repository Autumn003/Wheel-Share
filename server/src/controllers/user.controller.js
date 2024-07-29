import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

// register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, avatar } = req.body;

  if ([name, email, password].some((feild) => feild?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });

  res.status(200).json(new ApiResponse(201, user, "User created Successfully"));
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((feild) => feild?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("user password:", password);
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(400, "Invalid email or password");
  }
  user.password = undefined;

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Loggedin In Successfully"
      )
    );
});

// logout User
const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a reset ypur passwor here: \n\n ${resetUrl} \n\n If you has not make the reset password request, Ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request from WHEEL SHARE",
      message,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email sent successfully"));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(404, "Invalid or expired token");
  }

  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords doesn't match");
  }
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successful"));
});

// update avatar
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarImageLocalPath = req.file?.path;

  if (!avatarImageLocalPath) {
    throw new ApiError(400, "Avatar image file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete the old avatar from Cloudinary if it exists
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`wheelShare/avatars/${publicId}`);
    }

    user.avatar = avatar.secure_url;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update user avatar");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateAvatar,
};
