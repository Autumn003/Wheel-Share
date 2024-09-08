import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your name"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your name"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },

    avatar: {
      type: String,
    },

    ridesHistory: [
      {
        rideId: {
          type: Schema.Types.ObjectId,
          ref: "Ride",
        },
        source: {
          name: { type: String, required: true },
          coordinates: {
            type: [Number], // [lng, lat] format
            required: true,
          },
        },
        destination: {
          name: { type: String, required: true },
          coordinates: {
            type: [Number], // [lng, lat] format
            required: true,
          },
        },
        departureTime: {
          type: Date,
          required: true,
        },
        driver: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    refreshToken: {
      type: String,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// encrypt password before save (only if there is modification in password field)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// generate JWT tokens
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// generate resetPasswordToken
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
