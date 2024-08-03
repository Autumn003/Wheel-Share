import { Message } from "../models/message.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// create message
// const createMessage = asyncHandler(
//   async ({ sender, receiver, content, ride }) => {
//     if (!sender || !receiver || !content) {
//       console.log({ sender, receiver, content, ride });

//       throw new ApiError(400, "Sender, reciever & content is required");
//     }

//     try {
//       return await Message.create({
//         sender,
//         receiver,
//         content,
//         ride,
//       });
//     } catch (error) {
//       console.log(error);
//       throw new ApiError(500, "failed to create message");
//     }
//   }
// );

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

export { sendMessage, getMessages };
