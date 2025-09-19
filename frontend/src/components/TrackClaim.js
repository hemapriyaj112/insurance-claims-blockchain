import React, { useState } from "react";
import "./Form.css";

const TrackClaim = () => {
  const [claimId, setClaimId] = useState("");
  const [claimStatus, setClaimStatus] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    // For now simulate response. Later connect to blockchain.
    if (claimId === "12345") {
      setClaimStatus("Approved - Amount will be credited soon");
    } else if (claimId) {
      setClaimStatus("In Review");
    } else {
      setClaimStatus("No claim found with this ID");
    }
  };

  return (
    <div className="form-container">
      <h2>Track Your Claim</h2>
      <form onSubmit={handleTrack}>
        <label>Enter Claim ID</label>
        <input
          type="text"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          placeholder="Enter your claim ID"
          required
        />
        <button type="submit" className="btn-primary">
          Track Claim
        </button>
      </form>

      {claimStatus && (
        <div className="claim-status">
          <h3>Status:</h3>
          <p>{claimStatus}</p>
        </div>
      )}
    </div>
  );
};

export default TrackClaim;
