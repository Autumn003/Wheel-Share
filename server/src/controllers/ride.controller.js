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

  await ride.save();

  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride joined successfully"));
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

  await ride.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Ride leaved successfully"));
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
