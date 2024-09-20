import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// login user
export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/login`,
        userData,
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

// register
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/register`,
        userData,
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

// logout user
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/user/logout`);
      return;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

// user details
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/user/profile`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // If access token is expired, try refreshing it
        try {
          await axios.get(`${apiUrl}/api/v1/user/refresh-token`, {
            withCredentials: true,
          });

          // Retry fetching user details with the new token
          const retryResponse = await axios.get(
            `${apiUrl}/api/v1/user/profile`,
            {
              withCredentials: true,
            }
          );
          return retryResponse.data.data;
        } catch (refreshError) {
          return rejectWithValue("Session expired, please log in again");
        }
      } else {
        return rejectWithValue(error.response.data.message);
      }
    }
  }
);

// forget password
export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/forgot-password`,
        {
          email,
        }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// reset password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/user/reset-password/${token}`,
        userData
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// update user details
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/user/update-user`,
        userData,
        {
          withCredentials: true,
        }
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

// update user avatar
export const updateUserAvatar = createAsyncThunk(
  "user/updateUserAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/user/update-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
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

// update password
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/v1/user/update-password`,
        passwordData,
        {
          withCredentials: true,
        }
      );
      return response.data.message;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);
