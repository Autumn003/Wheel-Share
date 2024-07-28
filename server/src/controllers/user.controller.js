import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

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

// logoutUser
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

export { registerUser, loginUser, logoutUser };
