import { createSlice } from "@reduxjs/toolkit";
import {
  getRideDetails,
  joinRide,
  leaveRide,
  updateRide,
  updateSeats,
} from "../actions/ride.action";

import { toast } from "@/components/ui/use-toast";

const rideSlice = createSlice({
  name: "rideDetails",
  initialState: {
    ride: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRideDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRideDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
      })
      .addCase(getRideDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(joinRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
        toast({
          title: "Ride Joinded successfully",
          status: "success",
        });
      })
      .addCase(joinRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(leaveRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
        toast({
          title: "Ride Leaved",
          status: "success",
        });
      })
      .addCase(leaveRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(updateSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
        toast({
          title: "Seats updated successfully",
          status: "success",
        });
      })
      .addCase(updateSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(updateRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
        toast({ description: "Ride updated successfully", status: "success" });
      })
      .addCase(updateRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      });
  },
});

export default rideSlice.reducer;
