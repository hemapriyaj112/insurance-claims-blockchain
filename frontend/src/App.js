import React, { useEffect, useState } from "react";
import Web3 from "web3";
import InsuranceClaims from "./contracts/InsuranceClaims.json";
import Dashboard from "./components/dashboard";

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBlockchainData = async () => {
    const web3 = new Web3(window.ethereum || window.web3.currentProvider);
    window.web3 = web3;

    try {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = InsuranceClaims.networks[networkId];

      if (deployedNetwork) {
        const instance = new web3.eth.Contract(
          InsuranceClaims.abi,
          deployedNetwork.address
        );
        setContract(instance);

        const policyCount = await instance.methods.policyCount().call();
        let loadedPolicies = [];
        for (let i = 1; i <= policyCount; i++) {
          let p = await instance.methods.policies(i).call();
          loadedPolicies.push({
            id: p.policyId,
            policyNumber: p.policyNumber,
            details: p.details,
            coverageAmount: p.coverageAmount,
            startDate: p.startDate,
            endDate: p.endDate,
            status: p.status,
            contactInfo: p.contactInfo,
            holder: p.holder,
          });
        }
        setPolicies(loadedPolicies);

        const claimCount = await instance.methods.claimCount().call();
        let loadedClaims = [];
        for (let i = 1; i <= claimCount; i++) {
          let c = await instance.methods.claims(i).call();
          loadedClaims.push({
            id: c.claimId,
            policyId: c.policyId,
            claimantName: c.claimantName,
            incidentDate: c.incidentDate,
            incidentDescription: c.incidentDescription,
            claimAmount: c.claimAmount,
            claimStatus: c.claimStatus,
            claimant: c.claimant,
          });
        }
        setClaims(loadedClaims);

      } else {
        alert("Smart contract not deployed on detected network.");
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  // Register Policy
  const onRegisterPolicy = async ({
  policyNumber,
  details,
  coverageAmount,
  startDate,
  endDate,
  status,
  contactInfo
}) => {
  if (!contract || !account) {
    alert("Blockchain not loaded yet.");
    return;
  }

  try {
    setLoading(true);

    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    // Properly convert status string to boolean for Solidity bool
    const isActive = (status.toLowerCase() === "active");

    await contract.methods.registerPolicy(
      policyNumber,
      details,
      coverageAmount,
      startTimestamp,
      endTimestamp,
      isActive,
      contactInfo
    ).send({ from: account });

    alert("Policy registered successfully!");
    await loadBlockchainData();
  } catch (error) {
    console.error("Error registering policy:", error);
    alert(error.message || "Policy registration failed.");
  } finally {
    setLoading(false);
  }
};


  // Submit Claim
  const onSubmitClaim = async ({
    policyId,
    claimantName,
    incidentDate,
    incidentDescription,
    claimAmount
  }) => {
    if (!contract || !account) {
      alert("Blockchain not loaded yet.");
      return;
    }

    try {
      setLoading(true);

      const incidentTimestamp = Math.floor(new Date(incidentDate).getTime() / 1000);
      const pId = Number(policyId);
      const cAmount = Number(claimAmount);

      // Basic validation
      if (
        isNaN(pId) || pId <= 0 || !claimantName || !incidentDate || !incidentDescription || isNaN(cAmount) || cAmount <= 0
      ) {
        alert("Please provide valid inputs for all fields.");
        setLoading(false);
        return;
      }

      // Check policy ownership and status
      const policy = await contract.methods.policies(pId).call();
      if (policy.holder.toLowerCase() !== account.toLowerCase()) {
        alert("You are not the holder of this policy.");
        setLoading(false);
        return;
      }
      if (policy.status !== "0") { // 0 = Active, 1 = Inactive in enum
        alert("Policy is not active.");
        setLoading(false);
        return;
      }

      await contract.methods.submitClaim(
        pId,
        claimantName,
        incidentTimestamp,
        incidentDescription,
        cAmount
      ).send({ from: account });

      alert("Claim submitted successfully!");
      await loadBlockchainData();
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert(error.message || "Claim submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f57c1f", minHeight: "100vh", padding: "20px 0" }}>
      <h1 style={{ color: "#fff", textAlign: "center", marginBottom: 28 }}>
        Insurance Claims BlockChain
      </h1>

      <Dashboard
        policies={policies}
        claims={claims}
        onRegisterPolicy={onRegisterPolicy}
        onSubmitClaim={onSubmitClaim}
        account={account}
      />

      {loading && (
        <div style={{ textAlign: "center", marginTop: 20, color: "#fff" }}>
          Loading...
        </div>
      )}
    </div>
  );
}

export default App;
