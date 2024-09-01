import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createRide = createAsyncThunk(
  "rides/createRide",
  async (rideData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/ride/create-ride", rideData);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const getRides = createAsyncThunk(
  "rides/searchRide",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/ride/search", formData);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const getRideDetails = createAsyncThunk(
  "rideDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/ride/${id}`);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);
