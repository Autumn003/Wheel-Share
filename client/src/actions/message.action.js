// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Fetch messages from the server
// export const fetchMessages = createAsyncThunk(
//   "messages/fetchMessages",
//   async (userId, { rejectWithValue }) => {
//     console.log(`user id in fetchMessage: ${userId}`);

//     try {
//       const response = await axios.get(`/api/v1/message/${userId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Send a message to the server
// export const sendMessage = createAsyncThunk(
//   "messages/sendMessage",
//   async (messageData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("/api/v1/message/send", messageData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// message.action.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const fetchMessages = createAsyncThunk(
//   "messages/fetchMessages",
//   async (userId, { rejectWithValue }) => {
//     console.log(`user id in fetchMessage: ${userId}`);
//     try {
//       const response = await axios.get(`/api/v1/message/${userId}`);
//       console.log(response.data); // Check if it's an array
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/message/${userId}`);
      console.log("Fetched messages:", response.data); // Log the fetched messages
      return response.data; // Return the fetched messages to be added to Redux state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/message/send", messageData);
      console.log(response.data); // Check if it's a single message object
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMessage = (message) => ({
  type: "messages/addMessage",
  payload: message,
});
