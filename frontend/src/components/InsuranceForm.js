import React, { useState } from "react";

function InsuranceForm({ contract, account }) {
  const [policyDetails, setPolicyDetails] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [claimDesc, setClaimDesc] = useState('');

  const registerPolicy = async () => {
    try {
      await contract.methods.registerPolicy(policyDetails).send({ from: account });
      alert('Policy Registered!');
      setPolicyDetails('');
    } catch (err) {
      alert(err.message);
    }
  };

  const submitClaim = async () => {
    try {
      await contract.methods.submitClaim(policyId, claimDesc).send({ from: account });
      alert('Claim Submitted!');
      setClaimDesc('');
      setPolicyId('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h3>Register New Policy</h3>
      <input
        type="text"
        value={policyDetails}
        onChange={e => setPolicyDetails(e.target.value)}
        placeholder="Policy Details"
      />
      <button onClick={registerPolicy}>Register Policy</button>
      <h3>Submit Claim</h3>
      <input
        type="number"
        value={policyId}
        onChange={e => setPolicyId(e.target.value)}
        placeholder="Policy ID"
      />
      <input
        type="text"
        value={claimDesc}
        onChange={e => setClaimDesc(e.target.value)}
        placeholder="Claim Description"
      />
      <button onClick={submitClaim}>Submit Claim</button>
    </div>
  );
}

export default InsuranceForm;
