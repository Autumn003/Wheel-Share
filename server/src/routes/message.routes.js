import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/send").post(verifyJWT, sendMessage);
router.route("/:userId").get(verifyJWT, getMessages);

export default router;
