import mongoose, { Schema } from "mongoose";
import { trim } from "validator";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const rideSchema = new Schema(
  {
    driver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    riders: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 1,
    },
    vihcleType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    aditionalInfo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

rideSchema.plugin(mongooseAggregatePaginate);

export const Ride = mongoose.model("Ride", rideSchema);
