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
export const deleteRide = createAsyncThunk(
  "rides/deleteRide",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/v1/ride/delete-ride/${id}`);
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

export const fetcRidesHistory = createAsyncThunk(
  "ridesHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/user/rides-history`);
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

export const joinRide = createAsyncThunk(
  "rideDetails/joinRide",
  async ({ id, seatsToBook }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/ride/${id}/join-ride`, {
        seatsToBook,
      });
      return response.data.data;
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const leaveRide = createAsyncThunk(
  "rideDetails/leaveRide",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/ride/${id}/leave`);
      return response.data.data;
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const updateRide = createAsyncThunk(
  "rideDetails/updateRide",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/api/v1/ride/update-ride/${id}`,
        formData
      );
      return response.data.data;
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const updateSeats = createAsyncThunk(
  "rideDetails/updateSeats",
  async ({ id, newSeatsToBook }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/v1/ride/${id}/update-seats`, {
        newSeatsToBook,
      });
      return response.data.data;
    } catch (error) {
      console.log(error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);
