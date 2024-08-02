import mongoose, { Schema } from "mongoose";
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
        rider: { type: Schema.Types.ObjectId, ref: "User" },
        bookedSeats: { type: Number, required: true, min: 1 },
      },
    ],

    source: {
      name: { type: String, required: true },
      coordinates: {
        type: [Number], // [lng, lat] format
        required: true,
      },
    },
    destination: {
      name: { type: String, required: true },
      coordinates: {
        type: [Number], // [lng, lat] format
        required: true,
      },
    },

    departureTime: {
      type: Date,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

rideSchema.plugin(mongooseAggregatePaginate);
rideSchema.index({ "source.coordinates": "2dsphere" }); // to use geoNear in controller
rideSchema.index({ "destination.coordinates": "2dsphere" });

export const Ride = mongoose.model("Ride", rideSchema);
