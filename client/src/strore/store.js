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
