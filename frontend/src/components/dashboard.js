import React, { useState } from "react";
import RegisterPolicyForm from "./RegisterPolicyForm";
import SubmitClaimForm from "./SubmitClaimForm";

function Dashboard({ policies, claims, onRegisterPolicy, onSubmitClaim, account }) {
  const [tab, setTab] = useState("register");

  return (
    <div style={{ maxWidth: 600, margin: "auto", background: "white", padding: 20, borderRadius: 8 }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("register")} disabled={tab === "register"}>
          Register Policy
        </button>{" "}
        <button onClick={() => setTab("claim")} disabled={tab === "claim"}>
          Submit Claim
        </button>
      </div>

      {tab === "register" && <RegisterPolicyForm onRegisterPolicy={onRegisterPolicy} />}
      {tab === "claim" && <SubmitClaimForm policies={policies} onSubmitClaim={onSubmitClaim} />}

      <h3>Policies Registered</h3>
      <ul>
        {policies.map((p) => (
          <li key={p.id}>
            <strong>{p.policyNumber}</strong> - Holder: {p.holder} - Status: {Number(p.status) === 0 ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>

      <h3>Claims Submitted</h3>
      <ul>
        {claims.map((c) => (
          <li key={c.id}>
            Claim #{c.id} for Policy #{c.policyId}: {c.incidentDescription} - Amount: {c.claimAmount} - Status: {["Pending", "Approved", "Rejected"][c.claimStatus]}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => alert(`Policies Registered: ${policies.length}`)}>
          Policies Registered
        </button>{" "}
        <button onClick={() => alert(`Number of Claims: ${claims.length}`)}>
          Number of Claims
        </button>
      </div>

      <p>Connected account: {account}</p>
    </div>
  );
}

export default Dashboard;
