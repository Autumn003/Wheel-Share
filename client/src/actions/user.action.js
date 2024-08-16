import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/user/login", userData);
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

// register
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/user/register", userData);
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

// logout user
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/user/logout");
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

// Action to fetch user details
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/user/profile", {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If access token is expired, try refreshing it
        try {
          await axios.get("/api/v1/user/refresh-token", {
            withCredentials: true,
          });

          // Retry fetching user details with the new token
          const retryResponse = await axios.get("/api/v1/user/profile", {
            withCredentials: true,
          });
          return retryResponse.data.data;
        } catch (refreshError) {
          // If refreshing fails, log out the user
          // dispatch(logoutUser());
          return rejectWithValue("Session expired, please log in again");
        }
      } else {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);
