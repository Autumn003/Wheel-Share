import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

export const fetchConversations = createAsyncThunk(
  "conversations/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/message");
      return response.data.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response.data);
    }
  }
);
