import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { fetchUser } from "./actions/user.action.js";

import {
  CreateRide,
  Header,
  Home,
  Profile,
  ResetPassword,
  RideDetails,
  RideHistory,
} from "./components/index.js";

import { Toaster } from "./components/ui/toaster.jsx";
import { resetUserError } from "./slices/user.slice.js";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser()).finally(() => {
      dispatch(resetUserError());
    });
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/profile" Component={Profile} />
        <Route path="/" Component={Home} />
        <Route path="/reset-password/:token" Component={ResetPassword} />
        <Route path="/create-ride" Component={CreateRide} />
        <Route path="/ride/:id" Component={RideDetails} />
        <Route path="/ride-history" Component={RideHistory} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
