import { Message } from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { reciever, content, ride } = req.body;

  if (!reciever || !content) {
    throw new ApiError(400, "Reciever and content required");
  }

  try {
    const message = await Message.create({
      sender: req.user._id,
      reciever,
      content,
      ride,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, message, "Message sent successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to send message");
  }
});

// get messages for a user
const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(404, "user not found");
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, reciever: req.user._id },
        { reciever: userId, sender: req.user._id },
      ],
    })
      .populate("sender", "name")
      .populate("reciever", "name");

    return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "failed to retrieved the messages");
  }
});

export { sendMessage, getMessages };
