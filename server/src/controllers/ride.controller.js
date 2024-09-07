import { Ride } from "../models/ride.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { addRideToHistory, deleteRideFromHistory } from "./user.controller.js";

// create ride
const createRide = asyncHandler(async (req, res) => {
  const {
    sourceName,
    destinationName,
    sourceLat,
    sourceLng,
    destinationLat,
    destinationLng,
    departureTime,
    availableSeats,
    vehicleType,
    price,
    additionalInfo,
  } = req.body;

  // Validate required fields and data
  if (
    !sourceName ||
    !sourceLat ||
    !sourceLng ||
    !destinationName ||
    !destinationLat ||
    !destinationLng ||
    !departureTime ||
    !availableSeats ||
    !vehicleType ||
    !price
  ) {
    throw new ApiError(400, "All required fields must be filled.");
  }

  if (new Date(departureTime) <= new Date()) {
    throw new ApiError(400, "Departure time must be in the future");
  }

  const allowedVehicleTypes = ["mini", "sedan", "suv"];
  if (!allowedVehicleTypes.includes(vehicleType.toLowerCase())) {
    throw new ApiError(
      400,
      `Vehicle type must be one of the following: ${allowedVehicleTypes.join(", ")}.`
    );
  }

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
      source: {
        name: sourceName,
        coordinates: [parseFloat(sourceLng), parseFloat(sourceLat)],
      },
      destination: {
        name: destinationName,
        coordinates: [parseFloat(destinationLng), parseFloat(destinationLat)],
      },
      departureTime,
      availableSeats,
      vehicleType: vehicleType.toLowerCase(),
      price,
      additionalInfo,
    });

    await addRideToHistory(req, res, ride._id);

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
      .populate("driver", "name email avatar")
      .populate({
        path: "riders.rider",
        select: "name email avatar", // select the fields you need
      });

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

// search ride
const searchRide = asyncHandler(async (req, res) => {
  const {
    sourceLat,
    sourceLng,
    destinationLat,
    destinationLng,
    searchDate,
    miniAvailableSeats,
  } = req.body;

  if (
    !sourceLat ||
    !sourceLng ||
    !destinationLat ||
    !destinationLng ||
    !searchDate
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  const minSeats = miniAvailableSeats || 1;

  // Convert searchDate to ISODate
  const startOfDay = new Date(`${searchDate}T00:00:00.000Z`);
  const endOfDay = new Date(`${searchDate}T23:59:59.999Z`);

  const maxDistance = 20000; // 20 km in meters

  try {
    // Find rides near the source location within 20 km
    const sourceRides = await Ride.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(sourceLng), parseFloat(sourceLat)],
          },
          distanceField: "dist.calculated",
          maxDistance: maxDistance,
          spherical: true,
          key: "source.coordinates",
        },
      },
      {
        $match: {
          departureTime: { $gte: startOfDay, $lte: endOfDay },
          availableSeats: { $gte: minSeats },
        },
      },
    ]);

    // Find rides near the destination location within 20 km
    const destinationRides = await Ride.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(destinationLng),
              parseFloat(destinationLat),
            ],
          },
          distanceField: "dist.calculated",
          maxDistance: maxDistance,
          spherical: true,
          key: "destination.coordinates",
        },
      },
      {
        $match: {
          departureTime: { $gte: startOfDay, $lte: endOfDay },
          availableSeats: { $gte: minSeats },
        },
      },
    ]);

    // Find common rides based on ride IDs
    const commonRideIds = new Set(
      destinationRides.map((ride) => ride._id.toString())
    );
    const rides = sourceRides.filter((ride) =>
      commonRideIds.has(ride._id.toString())
    );

    if (!rides.length) {
      return res.status(404).json(new ApiResponse(404, null, "No rides found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, rides, "Rides fetched successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to fetch rides");
  }
});

// update ride by driver
const updateRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user._id;

  const { departureTime, availableSeats, vehicleType, price, additionalInfo } =
    req.body;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  // check if user is creator of ride
  if (ride?.driver.toString() !== userId.toString()) {
    throw new ApiError(4031, "You are not authorized to update this ride");
  }

  // Validate departureTime: must be in the future
  if (departureTime && new Date(departureTime) <= new Date()) {
    throw new ApiError(400, "Departure time must be in the future");
  }

  // Validate vehicleType: must be one of the allowed options
  const allowedVehicleTypes = ["mini", "sedan", "suv"];
  if (vehicleType && !allowedVehicleTypes.includes(vehicleType.toLowerCase())) {
    throw new ApiError(
      400,
      `Vehicle type must be one of the following: ${allowedVehicleTypes.join(", ")}`
    );
  }

  // Validate price: must be a positive number
  if (price && price <= 0) {
    throw new ApiError(400, "Price must be a positive number.");
  }

  // update ride with new details
  ride.departureTime = departureTime || ride.departureTime;
  ride.availableSeats =
    availableSeats !== undefined ? availableSeats : ride.availableSeats;
  ride.vehicleType = vehicleType ? vehicleType.toLowerCase() : ride.vehicleType;
  ride.price = price !== undefined ? price : ride.price;
  ride.additionalInfo = additionalInfo || ride.additionalInfo;

  try {
    const updatedRide = await ride.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(200, updatedRide, "Ride updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to update ride");
  }
});

// delete ride by driver
const deleteRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride?.driver.toString() !== userId.toString()) {
    throw new ApiError(401, "You are not authorized to delete this ride");
  }

  await ride.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Ride deleted successfully"));
});

// Join a ride
const joinRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.id;
  const { seatsToBook } = req.body;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (ride.availableSeats <= 0) {
    throw new ApiError(400, "Ride is fully booked");
  }

  if (seatsToBook <= 0 || seatsToBook > ride.availableSeats) {
    throw new ApiError(
      400,
      `you can book minimum 1 and maximum ${ride.availableSeats} seats`
    );
  }

  const existingRider = await ride.riders.find(
    (rider) => rider.rider.toString() === userId.toString()
  );
  if (existingRider) {
    throw new ApiError(400, "You are already booked for this ride");
  }

  ride.riders.push({ rider: userId, bookedSeats: seatsToBook });
  if (ride.availableSeats - seatsToBook >= 0) {
    ride.availableSeats -= seatsToBook;
  }

  try {
    await ride.save();
    addRideToHistory(req, res, rideId);
    return res
      .status(200)
      .json(new ApiResponse(200, ride, "Ride joined successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to join ride");
  }
});

// leave a joined ride
const leaveRide = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.id;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  const riderIndex = ride.riders.findIndex(
    (rider) => rider.rider.toString() === userId.toString()
  );
  if (riderIndex === -1) {
    throw new ApiError(400, "You are not booked for this ride");
  }

  const bookedSeats = ride.riders[riderIndex].bookedSeats;
  ride.riders.splice(riderIndex, 1);

  ride.availableSeats += bookedSeats;

  try {
    await ride.save();
    deleteRideFromHistory(req, res, rideId);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Ride leaved successfully"));
  } catch (error) {
    throw new ApiError(500, "failed to leave ride");
  }
});

// update the number of seats booked
const updateSeats = asyncHandler(async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.id;
  const { newSeatsToBook } = req.body;

  if (!newSeatsToBook || newSeatsToBook < 1) {
    throw new ApiError(400, "The number of seats to book must be at least 1");
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  // Check if the user has joined the ride
  const riderIndex = ride.riders.findIndex(
    (rider) => rider.rider.toString() === userId.toString()
  );
  if (riderIndex === -1) {
    throw new ApiError(400, "You are not booked for this ride");
  }

  const preveousSeatsBooked = ride.riders[riderIndex].bookedSeats;

  const seatsDiffrence = newSeatsToBook - preveousSeatsBooked;

  if (seatsDiffrence > 0 && ride.availableSeats < seatsDiffrence) {
    throw new ApiError(
      400,
      `only ${ride.availableSeats} seats are available to book`
    );
  }

  ride.riders[riderIndex].bookedSeats = newSeatsToBook;

  ride.availableSeats -= seatsDiffrence;

  await ride.save();
  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Seats updated successfully"));
});

export {
  createRide,
  getRideDetails,
  searchRide,
  updateRide,
  deleteRide,
  joinRide,
  leaveRide,
  updateSeats,
};
