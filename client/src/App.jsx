import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { fetchUser } from "./actions/user.action.js";

import { Header, Home, Profile } from "./components/index.js";

import store from "./strore/store.js";

function App() {
  useEffect(() => {
    store.dispatch(fetchUser());
  }, []);

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
