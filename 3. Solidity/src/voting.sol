// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.14;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered; // if true, that person already registred
        bool hasVoted; // if true, that person already voted
        uint256 votedProposalId; // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        string description;
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

    uint256 winningProposalId;

    uint256 proposalNumber = 1;

    mapping(address => Voter) public voters;

    mapping(uint256 => Proposal) public proposals;

    WorkflowStatus voteStatus;

    //events declaration
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    modifier onlyWhitelist() {
        require(voters[msg.sender].isRegistered, "Caller not a known voter");
        _;
    }

    constructor() {
        voteStatus = WorkflowStatus.RegisteringVoters;
    }

    function addVoter(address _addrVoter) external onlyOwner {
        require(
            voters[_addrVoter].isRegistered = false,
            "The voter is already registred !"
        );
        voters[_addrVoter] = Voter(true, false, 0);
    }

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

    function addProposal(string memory _proposal) external onlyWhitelist {
        require(
            voteStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Add a proposal only when the proposal registration is started"
        );
        proposals[proposalNumber] = Proposal(_proposal, 0);
        emit ProposalRegistered(proposalNumber);
        proposalNumber + 1;
    }

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

    function startVotingSession() external onlyOwner {
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

    function addVote(uint256 _proposalId) external onlyWhitelist {
        require(
            voteStatus == WorkflowStatus.VotingSessionStarted,
            "Voting is only when the voting session is started"
        );
        require(voters[msg.sender].hasVoted = true, "you have already voted !");
        require(
            bytes(proposals[_proposalId].description).length > 0,
            "the proposal does not exist"
        );
        proposals[_proposalId].voteCount + 1;

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

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
        for (uint256 proposal = 1; proposal <= proposalNumber; proposal++) {
            if (proposals[proposal].voteCount > max) {
                max = proposals[proposal].voteCount;
                winningProposalId = proposal;
            }
        }
    }

    function getWinner() external view returns (Proposal memory) {
        require(
            voteStatus == WorkflowStatus.VotesTallied,
            "The votes are not counted"
        );
        return proposals[winningProposalId];
    }
}
