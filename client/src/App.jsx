import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { fetchUser } from "./actions/user.action.js";
import {
  Conversations,
  CreateRide,
  Footer,
  Header,
  Home,
  Messaging,
  Profile,
  ResetPassword,
  RideDetails,
  RideHistory,
  SearchRide,
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
      <MainContent />
      <Toaster />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  // Check if the current path is not the messaging page
  const showFooter = !(
    location.pathname.startsWith("/messages") ||
    location.pathname.startsWith("/inbox")
  );

  return (
    <>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/search-ride" element={<SearchRide />} />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/ride/:id" element={<RideDetails />} />
        <Route path="/ride-history" element={<RideHistory />} />
        <Route path="/inbox" element={<Conversations />} />
        <Route path="/messages/:userId" element={<Messaging />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}

export default App;
