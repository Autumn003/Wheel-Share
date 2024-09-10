// import { createSlice } from "@reduxjs/toolkit";
// import { fetchMessages, sendMessage } from "@/actions/message.action";

// const initialState = {
//   messages: [],
//   loading: false,
//   error: null,
// };

// const messageSlice = createSlice({
//   name: "messages",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch messages
//       .addCase(fetchMessages.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchMessages.fulfilled, (state, action) => {
//         state.loading = false;
//         state.messages = action.payload;
//       })
//       .addCase(fetchMessages.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Send a message
//       .addCase(sendMessage.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(sendMessage.fulfilled, (state, action) => {
//         state.loading = false;
//         console.log("Message sent:", action.payload); // Log the payload
//         if (Array.isArray(state.messages)) {
//           state.messages.push(action.payload);
//         } else {
//           console.error("Messages state is not an array");
//         }
//       })
//       .addCase(sendMessage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default messageSlice.reducer;
// message.slice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, sendMessage } from "@/actions/message.action";

const initialState = {
  messages: [], // Ensure this is an array
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // Check if state.messages and state.messages.data exist and are arrays
      if (state.messages && Array.isArray(state.messages.messages.data)) {
        state.messages.messages.data.push(action.payload); // Add the new message to the messages array
      } else {
        console.error("Expected state.messages.data to be an array");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload; // Ensure payload is an array
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        // Check if action.payload is valid and an array
        if (Array.isArray(state.messages)) {
          state.messages.push(action.payload);
        } else {
          console.error("Expected state.messages to be an array");
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase("messages/addMessage", (state, action) => {
        // Check if state.messages is valid
        if (Array.isArray(state.messages)) {
          state.messages.push(action.payload);
        } else {
          console.error("Expected state.messages to be an array");
        }
      });
  },
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;
