import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

//register new user
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData) => {
    try {
      const response = await axios.post("/api/v1/user/register", userData);
      console.log(response.data);

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  }
);
