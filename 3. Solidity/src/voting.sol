// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable {
    /// Types
    struct Voter {
        bool isRegistered; // if true, that person already registred
        bool hasVoted; // if true, that person already voted
        uint256 votedProposalId; // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        string description; //proposal
        uint256 voteCount; // number of accumulated votes
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }
    // Id of the WinningProposal, default 0
    uint256 winningProposalId;

    // Count the number of proposal, 0 default
    uint256 proposalNumber = 1;

    mapping(address => Voter) public voters;

    mapping(uint256 => Proposal) public proposals;

    // Voting contract status
    WorkflowStatus voteStatus;

    /// Events
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    /// Modifiers
    // Check if the msg.senger is registrated
    modifier onlyWhitelist() {
        require(voters[msg.sender].isRegistered, "Caller not a known voter");
        _;
    }

    /// Constructor
    constructor() {
        voteStatus = WorkflowStatus.RegisteringVoters;
    }

    /// Functions

    //Add a new voter in the whitelist
    function addVoter(address _addrVoter) external onlyOwner {
        require(
            voteStatus == WorkflowStatus.RegisteringVoters,
            "The voting session already start !"
        );
        require(
            !voters[_addrVoter].isRegistered,
            "The voter is already registred !"
        );
        voters[_addrVoter] = Voter(true, false, 0);
    }

    // The voting administrator starts the recording session of the proposal
    function startProposalEnregistration() external onlyOwner {
        require(
            voteStatus == WorkflowStatus.RegisteringVoters,
            "The proposal enregistration can only be start when the status it's registration"
        );
        voteStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    // Registered voters are allowed to register their proposals while the registration session is active.
    function addProposal(string memory _proposal) external onlyWhitelist {
        require(
            voteStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Add a proposal only when the proposal registration is started"
        );
        proposals[proposalNumber] = Proposal(_proposal, 0);
        emit ProposalRegistered(proposalNumber);
        ++proposalNumber;
    }

    // Voting administrator ends proposal recording session
    function EndProposalEnregistration() external onlyOwner {
        require(
            voteStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "The proposal enregistration can only be stop when the status it's registration start"
        );
        voteStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    // The voting administrator starts the voting session
    function startVotingSession() external onlyOwner {
        require(
            bytes(proposals[1].description).length > 0,
            "there are no proposals"
        );
        require(
            voteStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "The voting session can only be start when the status it's registration ended"
        );
        voteStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    // Registered voters vote for their preferred proposal.
    function addVote(uint256 _proposalId) external onlyWhitelist {
        require(
            voteStatus == WorkflowStatus.VotingSessionStarted,
            "Voting is only when the voting session is started"
        );
        require(!voters[msg.sender].hasVoted, "you have already voted !");
        require(
            bytes(proposals[_proposalId].description).length > 0,
            "the proposal does not exist"
        );
        proposals[_proposalId].voteCount++;

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    // The voting administrator ends the voting session
    function stopVotingSession() external onlyOwner {
        require(
            voteStatus == WorkflowStatus.VotingSessionStarted,
            "The voting session can only be stop when the status it's voting session start"
        );
        voteStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    // The voting administrator counts the votes
    function endVotingSession() external onlyOwner {
        require(
            voteStatus == WorkflowStatus.VotingSessionEnded,
            "The voting session can only be endding when the status it's voting session stop"
        );
        voteStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
        uint256 max;
        uint256 winner;
        for (uint256 proposal = 1; proposal <= proposalNumber; proposal++) {
            if (proposals[proposal].voteCount > max) {
                max = proposals[proposal].voteCount;
                winner = proposal;
            }
        }
        winningProposalId = winner;
    }

    // Everyone can check the final details of the winning proposal
    function getWinner() external view returns (Proposal memory) {
        require(
            voteStatus == WorkflowStatus.VotesTallied,
            "The votes are not counted"
        );
        return proposals[winningProposalId];
    }
}
