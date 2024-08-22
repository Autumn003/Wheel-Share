import { createSlice } from "@reduxjs/toolkit";
import { createRide } from "../actions/ride.action";

const rideSlice = createSlice({
  name: "ride",
  initialState: {
    rides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = [...state.rides, action.payload];
      })
      .addCase(createRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default rideSlice.reducer;
