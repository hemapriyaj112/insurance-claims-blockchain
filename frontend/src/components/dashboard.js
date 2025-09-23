import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import InsuranceClaimsABI from "../abis/InsuranceClaims.json";
import "./Dashboard.css";

const Dashboard = () => {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [activePoliciesCount, setActivePoliciesCount] = useState(0);
  const [approvedClaimsCount, setApprovedClaimsCount] = useState(0);
  const [processingClaimsCount, setProcessingClaimsCount] = useState(0);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        if (!window.ethereum) {
          console.error("MetaMask not detected. Please install it.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const networkId = network.chainId.toString();
        const deployedNetwork = InsuranceClaimsABI.networks[networkId] || InsuranceClaimsABI.networks["1337"];

        if (!deployedNetwork) {
          console.error("Contract not deployed on this network.");
          return;
        }

        const contract = new ethers.Contract(
          deployedNetwork.address,
          InsuranceClaimsABI.abi,
          provider
        );

        // Fetch policy and claim data
        const totalPolicies = Number(await contract.policyCount());
        const totalClaims = Number(await contract.claimCount());

        const fetchedPolicies = [];
        for (let i = 1; i <= totalPolicies; i++) {
          const policy = await contract.policies(i);
          fetchedPolicies.push({
            policyId: Number(policy[0]),
            policyNumber: policy[1],
            details: policy[2],
            status: policy[3],
          });
        }

        const fetchedClaims = [];
        let processingCount = 0;
        let approvedCount = 0;
        for (let i = 1; i <= totalClaims; i++) {
          const claim = await contract.claims(i);
          fetchedClaims.push({
            claimId: Number(claim[0]),
            policyId: Number(claim[1]),
            description: claim[2],
            status: claim[3],
          });
          if (claim[3] === 0) { // Pending status
            processingCount++;
          } else if (claim[3] === 1) { // Approved status
            approvedCount++;
          }
        }

        setPolicies(fetchedPolicies);
        setClaims(fetchedClaims);
        setActivePoliciesCount(totalPolicies); // Assuming all policies are active for simplicity
        setApprovedClaimsCount(approvedCount);
        setProcessingClaimsCount(processingCount);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    loadBlockchainData();
  }, []);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Processing";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "status-processing";
      case 1:
        return "status-approved";
      case 2:
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div className="dashboard-container">
      <div className="summary-boxes">
        <div className="summary-box">
          <h3>{activePoliciesCount}</h3>
          <p>Active Policies</p>
        </div>
        <div className="summary-box">
          <h3>{approvedClaimsCount}</h3>
          <p>Approved Claims</p>
        </div>
        <div className="summary-box">
          <h3>{processingClaimsCount}</h3>
          <p>Claims Processing</p>
        </div>
      </div>
      <div className="section-container">
        <div className="section">
          <h2>My Policies</h2>
          <div className="card-list">
            {policies.length === 0 ? (
              <p>No policies registered yet.</p>
            ) : (
              policies.map((policy) => (
                <div key={policy.policyId} className="card">
                  <span className="card-id">POL-{String(policy.policyId).padStart(3, '0')}</span>
                  <span className="card-status active">Active</span>
                  <p>{policy.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="section">
          <h2>My Claims</h2>
          <div className="card-list">
            {claims.length === 0 ? (
              <p>No claims submitted yet.</p>
            ) : (
              claims.map((claim) => (
                <div key={claim.claimId} className="card">
                  <span className="card-id">Claim #{claim.claimId}</span>
                  <span className={`card-status ${getStatusClass(claim.status)}`}>
                    {getStatusText(claim.status)}
                  </span>
                  <p>{claim.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
