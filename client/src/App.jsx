import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { fetchUser } from "./actions/user.action.js";

import { Header, Home, Profile } from "./components/index.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/profile" Component={Profile} />
        <Route path="/" Component={Home} />
      </Routes>
    </Router>
  );
}

export default App;
