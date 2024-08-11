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

//get user details
export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/user/${id}`);
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
