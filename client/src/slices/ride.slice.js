import { createSlice } from "@reduxjs/toolkit";
import { createRide, deleteRide, getRides } from "../actions/ride.action";

import { toast } from "@/components/ui/use-toast";

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
        toast({
          title: "Ride created",
          status: "success",
        });
      })
      .addCase(createRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(deleteRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRide.fulfilled, (state, action) => {
        state.loading = false;
        toast({
          title: "Ride Deleted",
          status: "success",
        });
      })
      .addCase(deleteRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      })
      .addCase(getRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRides.fulfilled, (state, action) => {
        state.loading = false;
        state.rides = action.payload;
      })
      .addCase(getRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.rides = [];
        toast({
          variant: "destructive",
          description: action.payload,
          status: "error",
        });
      });
  },
});

export default rideSlice.reducer;
