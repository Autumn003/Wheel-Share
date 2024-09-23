import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const createRide = createAsyncThunk(
  "rides/createRide",
  async (rideData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/ride/create-ride`,
        rideData,
        { withCredentials: true }
      );
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
      const response = await axios.delete(
        `${apiUrl}/api/v1/ride/delete-ride/${id}`,
        { withCredentials: true }
      );
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
      const response = await axios.post(
        `${apiUrl}/api/v1/ride/search`,
        formData
      );
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
      const response = await axios.get(`${apiUrl}/api/v1/ride/${id}`);
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
      const response = await axios.post(
        `${apiUrl}/api/v1/ride/${id}/join-ride`,
        {
          seatsToBook,
        },
        { withCredentials: true }
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

export const leaveRide = createAsyncThunk(
  "rideDetails/leaveRide",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/ride/${id}/leave`,
        {},
        { withCredentials: true }
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

export const updateRide = createAsyncThunk(
  "rideDetails/updateRide",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/ride/update-ride/${id}`,
        formData,
        { withCredentials: true }
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
      const response = await axios.post(
        `${apiUrl}/api/v1/ride/${id}/update-seats`,
        {
          newSeatsToBook,
        },
        { withCredentials: true }
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
