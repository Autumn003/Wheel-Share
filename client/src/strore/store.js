import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user.slice.js";
import rideReducer from "../slices/ride.slice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    rides: rideReducer,
  },
});

export default store;
