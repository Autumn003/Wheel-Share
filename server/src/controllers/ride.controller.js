import { Ride } from "../models/ride.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// create ride
const createRide = asyncHandler(async (req, res) => {
  const {
    source,
    destination,
    departureTime,
    availableSeats,
    vehicleType,
    price,
    additionalInfo,
  } = req.body;

  // Check for missing required fields
  if (
    !source ||
    !destination ||
    !departureTime ||
    !availableSeats ||
    !vehicleType ||
    !price
  ) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  // Validate departureTime: must be in the future
  if (new Date(departureTime) <= new Date()) {
    throw new ApiError(400, "Departure time must be in the future");
  }

  // Validate vehicleType: must be one of the allowed options
  const allowedVehicleTypes = ["mini", "sedan", "suv"];
  if (!allowedVehicleTypes.includes(vehicleType.toLowerCase())) {
    throw new ApiError(
      400,
      `Vehicle type must be one of the following: ${allowedVehicleTypes.join(", ")}.`
    );
  }

  // Validate price: must be a positive number
  if (price <= 0) {
    throw new ApiError(400, "Price must be a positive number.");
  }

  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(404, "User not found");
  }

  try {
    const ride = await Ride.create({
      driver: userId,
      source,
      destination,
      departureTime,
      availableSeats,
      vehicleType: vehicleType.toLowerCase(),
      price,
      additionalInfo,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride created successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to create ride");
  }
});

// ride details
const getRideDetails = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId)
      .populate("driver", "name email")
      .populate("riders", "name email");

    if (!ride) {
      throw new ApiError(404, "Ride not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride details retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "failed to retrieve ride details");
  }
});

// search rides
const searchRide = asyncHandler(async (req, res) => {
  const { source, destination, departureTime, availableSeats } = req.query;

  if (!source || !destination || !departureTime) {
    throw new ApiError(400, "* Fields are required");
  }

  const searchDepartureTime = new Date(departureTime);

  if (isNaN(searchDepartureTime.getTime())) {
    throw new ApiError(400, "Invalid departure time format.");
  }

  const query = {
    source: { $regex: source, $options: "i" },
    destination: { $regex: destination, $options: "i" },
    departureTime: { $regex: departureTime, $options: "i" },
    departureTime: { $gte: searchDepartureTime },
  };

  if (availableSeats) {
    const seats = parseInt(availableSeats, 10);
    if (isNaN(seats) || seats < 0) {
      throw new ApiError(400, "Available seats must be a positive number.");
    }
    query.availableSeats = { $gte: seats };
  }

  try {
    const rides = await Ride.find(query).populate("driver", "name email");

    if (!rides) {
      throw new ApiError(404, "No rides found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, rides, "Rides found successfully"));
  } catch (error) {
    console.log("error to find rides", error);
    throw new ApiError(500, "Failed, to retrieve rides");
  }
});

export { createRide, getRideDetails, searchRide };
