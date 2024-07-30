import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createRide,
  getRideDetails,
  searchRide,
} from "../controllers/ride.controller.js";

const router = Router();

router.route("/create-ride").post(verifyJWT, createRide);
router.route("/search").get(searchRide);
router.route("/:rideId").get(verifyJWT, getRideDetails);

export default router;
