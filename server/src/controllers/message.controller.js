import { Message } from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// create message
export const createMessage = async ({ sender, receiver, content, ride }) => {
  try {
    const message = await Message.create({
      sender,
      receiver,
      content,
      ride,
    });
    return message;
  } catch (error) {
    throw new ApiError(500, "Failed to create message");
  }
};

// send a message
const sendMessage = asyncHandler(async (req, res) => {
  const { receiver, content, ride } = req.body;

  if (!receiver || !content) {
    throw new ApiError(400, "Receiver and content required");
  }

  try {
    const message = await createMessage({
      sender: req.user._id,
      receiver,
      content,
      ride,
    });

    console.log(message);

    return res
      .status(200)
      .json(new ApiResponse(200, message, "Message sent successfully"));
  } catch (error) {
    console.log(error);

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
        { sender: userId, receiver: req.user._id },
        { receiver: userId, sender: req.user._id },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name");

    return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "failed to retrieved the messages");
  }
});

// Get list of conversations
const getConversations = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Ensure user ID is correct

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            sender: {
              $cond: [
                { $gte: ["$sender", "$receiver"] },
                "$sender",
                "$receiver",
              ],
            },
            receiver: {
              $cond: [
                { $gte: ["$sender", "$receiver"] },
                "$receiver",
                "$sender",
              ],
            },
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $project: {
          sender: { $arrayElemAt: ["$sender.name", 0] },
          receiver: { $arrayElemAt: ["$receiver.name", 0] },
          lastMessage: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          conversations,
          "Conversations retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error retrieving conversations:", error); // Log error details
    throw new ApiError(500, "Failed to retrieve conversations");
  }
});

export { sendMessage, getMessages, getConversations };
