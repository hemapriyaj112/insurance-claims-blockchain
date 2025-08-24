// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InsuranceClaims {
    enum PolicyStatus { Active, Inactive }
    enum ClaimStatus { Pending, Approved, Rejected }

    struct Policy {
        uint policyId;
        string policyNumber;      // User-defined policy number string
        string details;
        uint coverageAmount;
        uint startDate;           // timestamp
        uint endDate;             // timestamp
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
        ClaimStatus claimStatus;
        address claimant;
    }

    uint public policyCount;
    uint public claimCount;
    mapping(uint => Policy) public policies;
    mapping(uint => Claim) public claims;

    event PolicyRegistered(uint indexed policyId, string policyNumber, string details, address holder);
    event ClaimSubmitted(uint indexed claimId, uint policyId, address claimant);
    event ClaimStatusChanged(uint indexed claimId, ClaimStatus newStatus);

    function registerPolicy(
        string memory policyNumber,
        string memory details,
        uint coverageAmount,
        uint startDate,
        uint endDate,
        bool isActive,
        string memory contactInfo
    ) public {
        policyCount++;
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

    function submitClaim(
        uint policyId,
        string memory claimantName,
        uint incidentDate,
        string memory incidentDescription,
        uint claimAmount
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
            ClaimStatus.Pending,
            msg.sender
        );
        emit ClaimSubmitted(claimCount, policyId, msg.sender);
    }

    function approveClaim(uint claimId) public {
        require(claimId > 0 && claimId <= claimCount, "Invalid claim ID");
        require(claims[claimId].claimStatus == ClaimStatus.Pending, "Claim not pending");
        claims[claimId].claimStatus = ClaimStatus.Approved;
        emit ClaimStatusChanged(claimId, ClaimStatus.Approved);
    }

    function rejectClaim(uint claimId) public {
        require(claimId > 0 && claimId <= claimCount, "Invalid claim ID");
        require(claims[claimId].claimStatus == ClaimStatus.Pending, "Claim not pending");
        claims[claimId].claimStatus = ClaimStatus.Rejected;
        emit ClaimStatusChanged(claimId, ClaimStatus.Rejected);
    }
}
