// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract InsuranceClaims {
    enum PolicyStatus { Active, Inactive }
    enum ClaimStatus { Pending, Approved, Rejected }
    enum DocStatus { PendingVerification, Approved, Rejected }

    // Structs and Mappings
    struct Policy {
        string policyId;
        string insuranceType;
        PolicyStatus status;
    }

    struct Claim {
        uint claimId;
        string policyId;
        string description;
        string incidentDate;
        uint claimAmount;
        ClaimStatus status;
    }

    struct Document {
        uint docId;
        uint claimId;
        string docName;
        DocStatus status;
    }

    mapping(string => Policy) public policies;
    mapping(uint => Claim) public claims;
    mapping(uint => Document) public documents;
    mapping(string => bool) public policyExists;

    // State variables
    uint public claimCount = 0;
    uint public docCount = 0;
    address public owner;

    // Events
    event PolicyRegistered(string indexed policyId);
    event ClaimSubmitted(uint indexed claimId, string indexed policyId);

    // Constructor to set the deployer as the owner
    constructor() {
        owner = msg.sender;
    }
    
    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Function to register a new policy
    function registerPolicy(string memory _policyId, string memory _insuranceType) public {
        require(!policyExists[_policyId], "Policy already exists");
        policies[_policyId] = Policy(_policyId, _insuranceType, PolicyStatus.Active);
        policyExists[_policyId] = true;
        emit PolicyRegistered(_policyId);
    }

    // Function to submit a claim
    function submitClaim(string memory _policyId, string memory _description, string memory _incidentDate, uint _claimAmount) public {
        require(policyExists[_policyId], "wrong policy id");
        require(policies[_policyId].status == PolicyStatus.Active, "Policy not active");
        claimCount++;
        claims[claimCount] = Claim(claimCount, _policyId, _description, _incidentDate, _claimAmount, ClaimStatus.Pending);
        emit ClaimSubmitted(claimCount, _policyId);
    }

    // Function to add a document to a claim
    function addDocument(uint _claimId, string memory _docName) public {
        require(_claimId > 0 && _claimId <= claimCount, "Invalid claim ID");
        docCount++;
        documents[docCount] = Document(docCount, _claimId, _docName, DocStatus.PendingVerification);
    }

    // Function for owner to approve a claim
    function approveClaim(uint _claimId) public onlyOwner {
        require(_claimId > 0 && _claimId <= claimCount, "Invalid claim ID");
        claims[_claimId].status = ClaimStatus.Approved;
    }

    // Function for owner to reject a claim
    function rejectClaim(uint _claimId) public onlyOwner {
        require(_claimId > 0 && _claimId <= claimCount, "Invalid claim ID");
        claims[_claimId].status = ClaimStatus.Rejected;
    }

    // View function to check the status of a policy by ID
    function checkPolicyStatus(string memory _policyId) public view returns (PolicyStatus) {
        require(policyExists[_policyId], "Policy does not exist");
        return policies[_policyId].status;
    }

    // View function to check if a policy exists
    function doesPolicyExist(string memory _policyId) public view returns (bool) {
        return policyExists[_policyId];
    }
}
