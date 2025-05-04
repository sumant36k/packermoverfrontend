import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BookingPage from "./pages/BookingPage";
// import Header from "./components/Header"; // Import the Header component
// import Footer from "./components/Footer"; // Import the Footer component

import "./App.css";

const App = () => {
  return (
    <div className="page-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;


