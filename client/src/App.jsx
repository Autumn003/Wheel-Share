import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" Component={Register} />
      </Routes>
    </Router>
  );
}

export default App;
