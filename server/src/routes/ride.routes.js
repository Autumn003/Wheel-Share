import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createRide,
  deleteRide,
  getRideDetails,
  joinRide,
  leaveRide,
  searchRide,
  updateRide,
  updateSeats,
} from "../controllers/ride.controller.js";

const router = Router();

router.route("/create-ride").post(verifyJWT, createRide);
router.route("/search").get(searchRide);
router.route("/update-ride/:rideId").put(verifyJWT, updateRide);
router.route("/delete-ride/:rideId").delete(verifyJWT, deleteRide);
router.route("/:rideId/join-ride").post(verifyJWT, joinRide);
router.route("/:rideId/leave").post(verifyJWT, leaveRide);
router.route("/:rideId/update-seats").post(verifyJWT, updateSeats);
router.route("/:rideId").get(verifyJWT, getRideDetails);

export default router;
