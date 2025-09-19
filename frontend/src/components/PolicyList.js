import React from "react";

function PolicyList({ policies }) {
  return (
    <div>
      <h3>Registered Policies</h3>
      {policies.length === 0 ? (
        <p>No policies registered yet.</p>
      ) : (
        <ul>
          {policies.map((p, index) => (
            <li key={index}>
              <strong>Policy Number:</strong> {p.policyNumber} |{" "}
              <strong>Details:</strong> {p.details} |{" "}
              <strong>Coverage:</strong> {p.coverageAmount} |{" "}
              <strong>Status:</strong>{" "}
              {p.status === "0" ? "Active" : "Inactive"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PolicyList;
