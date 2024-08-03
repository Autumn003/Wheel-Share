import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ride: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);
