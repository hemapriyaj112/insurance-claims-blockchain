import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-image-placeholder">
          {/* Temporary placeholder for hero image */}
          {/* You can replace this div with <img src="YOUR_NEW_IMAGE_URL" /> later */}
        </div>
        <div className="hero-text">
          <h1>Decentralized, Secure, Trust</h1>
          <p>
            Manage your insurance policies and claims seamlessly on the blockchain.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature">
          <h3>Decentralized</h3>
          <p>All policies and claims are securely stored on blockchain.</p>
        </div>
        <div className="feature">
          <h3>Secure</h3>
          <p>End-to-end encryption ensures your data is safe and private.</p>
        </div>
        <div className="feature">
          <h3>Trust</h3>
          <p>Transparent process, verified and immutable on-chain.</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <h3>New Claim</h3>
          <p>Register a new policy and start coverage.</p>
          <a href="#learn-more">Learn More</a>
        </div>
        <div className="action-card">
          <h3>Existing Claim</h3>
          <p>Submit a claim for an existing policy.</p>
          <a href="#learn-more">Learn More</a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
