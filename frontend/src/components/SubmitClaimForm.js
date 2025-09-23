import React, { useState } from "react";
import { ethers } from "ethers";
import InsuranceClaimsABI from "../abis/InsuranceClaims.json";
import "./Form.css";

const SubmitClaimForm = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [description, setDescription] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmitClaim = async (e) => {
    e.preventDefault();

    // Trim inputs to avoid issues with spaces
    const trimmedPolicy = policyNumber.trim();
    const trimmedDescription = description.trim();

    // Frontend validation for all required fields
    if (!trimmedPolicy || !trimmedDescription || !insuranceType || !incidentDate || !claimAmount) {
      setStatus("❌ Please fill out all required fields.");
      return;
    }

    try {
      if (!window.ethereum) {
        setStatus("❌ MetaMask is not installed. Please install it to proceed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const networkId = network.chainId.toString();

      const deployedNetwork = InsuranceClaimsABI.networks[networkId] || InsuranceClaimsABI.networks["1337"];
      if (!deployedNetwork) {
        setStatus("❌ Contract not deployed on this network. Please check Ganache.");
        return;
      }

      const contract = new ethers.Contract(
        deployedNetwork.address,
        InsuranceClaimsABI.abi,
        signer
      );

      // Check if policy exists before submitting
      try {
        const policyExists = await contract.doesPolicyExist(trimmedPolicy);
        if (!policyExists) {
          setStatus("❌ Policy not registered. Please register the policy first.");
          return;
        }
      } catch (error) {
        // If the function doesn't exist or fails, proceed to submit and let it handle the error
        console.warn("doesPolicyExist check failed, proceeding to submit:", error);
      }

      setStatus("Submitting claim... Waiting for transaction.");

      const tx = await contract.submitClaim(trimmedPolicy, trimmedDescription, incidentDate, ethers.parseEther(claimAmount), { gasLimit: 300000 });
      await tx.wait();

      setStatus("✅ Claim submitted successfully!");
      // Reset form fields
      setPolicyNumber("");
      setDescription("");
      setInsuranceType("");
      setIncidentDate("");
      setClaimAmount("");
      setFiles(null);

    } catch (error) {
      console.error(error);
      if (error.code === 'CALL_EXCEPTION') {
        if (error.reason) {
          setStatus("❌ " + error.reason);
        } else {
          setStatus("❌ Transaction reverted without reason");
        }
      } else {
        setStatus("❌ Transaction failed: " + error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Submit Claim</h2>
      <form onSubmit={handleSubmitClaim}>
        <input
          type="text"
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Insurance Type"
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date of Incident"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Description of Incident"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Claim Amount (ETH)"
          value={claimAmount}
          onChange={(e) => setClaimAmount(e.target.value)}
          required
        />
        <label>
          Supporting Documents:
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </label>
        <button type="submit">Submit Claim</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default SubmitClaimForm;
