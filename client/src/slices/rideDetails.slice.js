import { createSlice } from "@reduxjs/toolkit";
import { getRideDetails } from "../actions/ride.action";

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
      });
  },
});

export default rideSlice.reducer;
