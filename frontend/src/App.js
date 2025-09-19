import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import RegisterPolicyForm from "./components/RegisterPolicyForm";
import SubmitClaimForm from "./components/SubmitClaimForm";
import TrackClaim from "./components/TrackClaim";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={isDarkMode ? "app dark-mode" : "app"}>
        {/* Navbar stays on top */}
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<RegisterPolicyForm />} />
            <Route path="/claim" element={<SubmitClaimForm />} />
            <Route path="/track" element={<TrackClaim />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
