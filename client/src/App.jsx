import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Register from "./components/user/Register.jsx";
import Home from "./components/home/Home.jsx";
import Header from "./components/layout/Header.jsx";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
        {/* <Route path="/register" Component={Register} /> */}
      </Routes>
    </Router>
  );
}

export default App;
