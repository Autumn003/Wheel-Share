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
  getUserRideHistory,
  addRideToHistory,
  deleteRideFromHistory,
  refreshAccessToken,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").put(resetPassword);
router.route("/refresh-token").get(refreshAccessToken);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router
  .route("/update-avatar")
  .put(verifyJWT, upload.single("avatar"), updateAvatar);

router.route("/profile").get(verifyJWT, getuserDetails);
router.route("/update-password").put(verifyJWT, updatePassword);
router.route("/update-user").put(verifyJWT, updateUserDetails);
router.route("/rides-history").get(verifyJWT, getUserRideHistory);
router.route("/rides-history").post(verifyJWT, addRideToHistory);
router.route("/rides-history").delete(verifyJWT, deleteRideFromHistory);

export default router;
