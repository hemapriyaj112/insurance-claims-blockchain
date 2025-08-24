import React, { useState } from "react";

function RegisterPolicyForm({ onRegisterPolicy }) {
  const [policyNumber, setPolicyNumber] = useState("");
  const [details, setDetails] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(true); // true = active
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegisterPolicy({
      policyNumber,
      details,
      coverageAmount: Number(coverageAmount),
      startDate,
      endDate,
      status: status ? "active" : "inactive",
      contactInfo,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
      <h3>Register New Policy</h3>
      <input
        type="text"
        placeholder="Policy Number"
        value={policyNumber}
        onChange={(e) => setPolicyNumber(e.target.value)}
        required
      />
      <br />
      <input
        type="text"
        placeholder="Policy Details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        required
      />
      <br />
      <input
        type="number"
        placeholder="Coverage Amount"
        value={coverageAmount}
        onChange={(e) => setCoverageAmount(e.target.value)}
        required
        min="0"
      />
      <br />
      <label>
        Start Date:{" "}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        End Date:{" "}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Status:{" "}
        <input
          type="checkbox"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
        />
        (Active)
      </label>
      <br />
      <input
        type="text"
        placeholder="Contact Information"
        value={contactInfo}
        onChange={(e) => setContactInfo(e.target.value)}
        required
      />
      <br />
      <button type="submit">Register Policy</button>
    </form>
  );
}

export default RegisterPolicyForm;
