import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// register new user
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/user/register", userData);
      const loginResponse = await axios.post("/api/v1/user/login", {
        email: userData.email,
        password: userData.password,
      });
      console.log(loginResponse.data);

      dispatch(loginUser(loginResponse.data));

      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        return rejectWithValue(error.response.data.message); // Capture the error message from the backend
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/user/login", userData);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        return rejectWithValue(error.response.data.message); // Capture the error message from the backend
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
        console.log(error.response.data);
        return rejectWithValue(error.response.data.message); // Capture the error message from the backend
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);
