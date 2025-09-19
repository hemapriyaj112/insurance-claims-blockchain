import React, { useState } from "react";

function RegisterPolicyForm() {
  const [policy, setPolicy] = useState({
    policyNumber: "",
    contact: "",
    details: "",
    coverage: "",
    startDate: "",
    endDate: "",
  });
  const [policyId, setPolicyId] = useState(null);

  const handleChange = (e) => {
    setPolicy({ ...policy, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a policy ID (simple example)
    const id = `POL-${Math.floor(Math.random() * 100000)}`;
    setPolicyId(id);
    // Here you would call your smart contract or backend API
    console.log("Policy registered:", { ...policy, policyId: id });
  };

  return (
    <div className="form-container">
      <h2>Register Policy</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="policyNumber"
          placeholder="Policy Number"
          value={policy.policyNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={policy.contact}
          onChange={handleChange}
          required
        />
        <textarea
          name="details"
          placeholder="Policy Details"
          value={policy.details}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="coverage"
          placeholder="Coverage Amount"
          value={policy.coverage}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="startDate"
          value={policy.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={policy.endDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Register Policy</button>
      </form>

      {policyId && (
        <div className="policy-id">
          <strong>Policy Registered! Your Policy ID:</strong> {policyId}
        </div>
      )}
    </div>
  );
}

export default RegisterPolicyForm;
