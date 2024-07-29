import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateAvatar,
  getuserDetails,
  updatePassword,
  updateUserDetails,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").put(resetPassword);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/update-avatar")
  .put(verifyJWT, upload.single("avatar"), updateAvatar);

router.route("/profile").get(verifyJWT, getuserDetails);
router.route("/update-password").put(verifyJWT, updatePassword);
router.route("/update-user").put(verifyJWT, updateUserDetails);

export default router;
