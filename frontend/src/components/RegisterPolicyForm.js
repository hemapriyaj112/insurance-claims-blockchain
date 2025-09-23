import React, { useState } from "react";
import { ethers } from "ethers";
import InsuranceClaimsABI from "../abis/InsuranceClaims.json";
import "./Form.css"; // Assuming Form.css is in the same folder

const RegisterPolicyForm = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [status, setStatus] = useState("");

  const handleRegisterPolicy = async (e) => {
    e.preventDefault();
    try {
      // Crucial validation: Check if fields are empty before sending the transaction.
      if (!policyNumber.trim() || !insuranceType.trim()) {
        setStatus("❌ Policy number and insurance type cannot be empty.");
        return;
      }

      if (!window.ethereum) {
        setStatus("MetaMask is required!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // **Robustly get the deployed contract address from the ABI**
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();
      const deployedNetwork = InsuranceClaimsABI.networks[chainId];
      if (!deployedNetwork) {
        setStatus("❌ Contract not deployed on this network. Please check Ganache/Hardhat.");
        return;
      }

      const contract = new ethers.Contract(
        deployedNetwork.address,
        InsuranceClaimsABI.abi,
        signer
      );

      setStatus("Transaction sent... Awaiting confirmation.");

      // This is the function call to the smart contract
      const tx = await contract.registerPolicy(policyNumber, insuranceType);

      await tx.wait();

      setStatus("✅ Policy registered successfully!");

    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction Failed: " + (err.message || "An unknown error occurred."));
    }
  };

  return (
    <div className="form-container">
      <h2>Register Policy</h2>
      <form onSubmit={handleRegisterPolicy}>
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
          type="number"
          placeholder="Coverage Amount (ETH)"
          value={coverageAmount}
          onChange={(e) => setCoverageAmount(e.target.value)}
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          required
        />
        <button type="submit">Register Policy</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default RegisterPolicyForm;
