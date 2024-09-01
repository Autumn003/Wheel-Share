import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice.js";
import ridesReducer from "../slices/ride.slice.js";
import rideDetailsReducer from "../slices/rideDetails.slice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    rides: ridesReducer,
    ride: rideDetailsReducer,
  },
});

export default store;
