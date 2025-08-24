import React, { useState } from "react";

function SubmitClaimForm({ policies, onSubmitClaim }) {
  const [policyId, setPolicyId] = useState("");
  const [claimantName, setClaimantName] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [claimAmount, setClaimAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitClaim({
      policyId,
      claimantName,
      incidentDate,
      incidentDescription,
      claimAmount: Number(claimAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Submit Claim</h3>

      <label>
        Select Policy:
        <select
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          required
        >
          <option value="">-- Select Policy --</option>
          {policies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.policyNumber} - {p.details}
            </option>
          ))}
        </select>
      </label>
      <br />

      <input
        type="text"
        placeholder="Claimant Name"
        value={claimantName}
        onChange={(e) => setClaimantName(e.target.value)}
        required
      />
      <br />
      <label>
        Date of Incident:{" "}
        <input
          type="date"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          required
        />
      </label>
      <br />

      <textarea
        placeholder="Description of Incident"
        value={incidentDescription}
        onChange={(e) => setIncidentDescription(e.target.value)}
        required
        rows={4}
      />
      <br />

      <input
        type="number"
        placeholder="Claim Amount"
        value={claimAmount}
        onChange={(e) => setClaimAmount(e.target.value)}
        required
        min="0"
      />
      <br />

      <button type="submit">Submit Claim</button>
    </form>
  );
}

export default SubmitClaimForm;
