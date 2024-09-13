import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "../slices/user.slice.js";
import ridesReducer from "../slices/ride.slice.js";
import rideDetailsReducer from "../slices/rideDetails.slice.js";
import messageReducer from "../slices/message.slice.js";
import conversationReducer from "../slices/conversation.slice.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  rides: ridesReducer,
  ride: rideDetailsReducer,
  messages: messageReducer,
  conversation: conversationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };

// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage";
// import { persistReducer, persistStore } from "redux-persist";
// import userReducer from "../slices/user.slice";
// import ridesReducer from "../slices/ride.slice";
// import rideDetailsReducer from "../slices/rideDetails.slice";

// // Define the persist configuration
// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["user"], // You can add other reducers here if needed
// };

// // Combine your reducers
// const rootReducer = combineReducers({
//   user: userReducer,
//   rides: ridesReducer,
//   ride: rideDetailsReducer,
// });

// // Persist the root reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure store with persisted reducer
// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// // Export persistor
// export const persistor = persistStore(store);

// export default store;
