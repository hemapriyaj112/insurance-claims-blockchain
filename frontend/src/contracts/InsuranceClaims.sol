// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsuranceClaims {
    enum PolicyStatus { Active, Inactive }
    enum ClaimStatus { Pending, Approved, Rejected }
    enum DocStatus { PendingVerification, Approved, Rejected }  // ✅ Added

    struct Policy {
        uint policyId;
        string policyNumber;
        string details;
        uint coverageAmount;
        uint startDate;
        uint endDate;
        PolicyStatus status;
        string contactInfo;
        address holder;
    }

    struct Claim {
        uint claimId;
        uint policyId;
        string claimantName;
        uint incidentDate;        // timestamp
        string incidentDescription;
        uint claimAmount;
        string insuranceType;     // ✅ New: "Health", "Motor", "Life", etc.
        string[] documents;       // ✅ New: IPFS/file hashes
        ClaimStatus claimStatus;
        DocStatus docStatus;      // ✅ New: track doc verification
        address claimant;
    }

    uint public policyCount;
    uint public claimCount;
    mapping(uint => Policy) public policies;
    mapping(uint => Claim) public claims;

    // ✅ Updated events
    event PolicyRegistered(uint indexed policyId, string policyNumber, string details, address holder);
    event ClaimSubmitted(uint indexed claimId, uint policyId, address claimant, string insuranceType);
    event ClaimStatusChanged(uint indexed claimId, ClaimStatus newStatus);
    event DocumentVerified(uint indexed claimId, DocStatus status);

    // ✅ Fixed bug: status assignment in registerPolicy
    function registerPolicy(
        string memory policyNumber,
        string memory details,
        uint coverageAmount,
        uint startDate,
        uint endDate,
        bool isActive,
        string memory contactInfo
    ) public {
        policyCount += 1;
        policies[policyCount] = Policy(
            policyCount,
            policyNumber,
            details,
            coverageAmount,
            startDate,
            endDate,
            isActive ? PolicyStatus.Active : PolicyStatus.Inactive,
            contactInfo,
            msg.sender
        );
        emit PolicyRegistered(policyCount, policyNumber, details, msg.sender);
    }

    // ✅ Updated to accept insurance type + documents
    function submitClaim(
        uint policyId,
        string memory claimantName,
        uint incidentDate,
        string memory incidentDescription,
        uint claimAmount,
        string memory insuranceType,
        string[] memory documents
    ) public {
        require(policyId > 0 && policyId <= policyCount, "Invalid policy ID");
        Policy memory policy = policies[policyId];
        require(policy.holder == msg.sender, "Not the policy holder");
        require(policy.status == PolicyStatus.Active, "Policy is not active");

        claimCount++;
        claims[claimCount] = Claim(
            claimCount,
            policyId,
            claimantName,
            incidentDate,
            incidentDescription,
            claimAmount,
            insuranceType,
            documents,
            ClaimStatus.Pending,
            DocStatus.PendingVerification,
            msg.sender
        );
        emit ClaimSubmitted(claimCount, policyId, msg.sender, insuranceType);
    }

    // ✅ Insurer verifies documents
    function verifyDocuments(uint claimId, bool approve) public {
        require(claimId > 0 && claimId <= claimCount, "Invalid claim ID");
        require(claims[claimId].docStatus == DocStatus.PendingVerification, "Already verified");

        if (approve) {
            claims[claimId].docStatus = DocStatus.Approved;
            claims[claimId].claimStatus = ClaimStatus.Approved;
        } else {
            claims[claimId].docStatus = DocStatus.Rejected;
            claims[claimId].claimStatus = ClaimStatus.Rejected;
        }
        emit DocumentVerified(claimId, claims[claimId].docStatus);
    }

    function getClaim(uint claimId) public view returns (
        uint, uint, string memory, uint, string memory, uint, string memory, ClaimStatus, DocStatus, address
    ) {
        Claim storage c = claims[claimId];
        return (
            c.claimId,
            c.policyId,
            c.claimantName,
            c.incidentDate,
            c.incidentDescription,
            c.claimAmount,
            c.insuranceType,
            c.claimStatus,
            c.docStatus,
            c.claimant
        );
    }
}
