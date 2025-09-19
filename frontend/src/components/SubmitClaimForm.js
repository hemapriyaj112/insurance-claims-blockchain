import React, { useState } from "react";

function SubmitClaimForm() {
  const [claim, setClaim] = useState({
    policyId: "",
    name: "",
    incidentDate: "",
    description: "",
    amount: "",
    documents: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setClaim({
      ...claim,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Claim submitted:", claim);
    alert("Claim submitted successfully!");
  };

  return (
    <div className="form-container">
      <h2>Submit Claim</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="policyId"
          placeholder="Policy ID"
          value={claim.policyId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={claim.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="incidentDate"
          value={claim.incidentDate}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description of Incident"
          value={claim.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Claim Amount"
          value={claim.amount}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="documents"
          onChange={handleChange}
          required
        />
        <button type="submit">Submit Claim</button>
      </form>
    </div>
  );
}

export default SubmitClaimForm;
