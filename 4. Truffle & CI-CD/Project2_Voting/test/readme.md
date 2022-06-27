# Voting contract testing

End of chapter Truffle project, CI/CD & unit tests.

The voting_test.js file contains the unit tests for the Voting Contract from the correction of the Solidity project.

It uses 2 librairies :
- openzeppelin's test-helpers library to test reverts and events.
-  chai library to use the expect function.

There are **41 unit tests.**

# 1 - GetVoter function

### **3 tests**
- should revert 'caller is not a voter'
- should return an empty value
- should return a registered voter

# 2 - GetOneProposal function

### **4 tests**
- should revert 'caller is not a voter'
- should revert an unspecified proposal
- should return an existing proposal with the correct description
- should return an existing proposal with the correct voteCount

# 3 - AddVoter Function

### **4 tests**
- should add user1 as voter and emit event
- should revert 'voter already registered'
- should revert 'caller is not the owner'
- should revert 'workflowstatus not RegisteringVoters'

# 4 - AddProposal Function

### **4 tests**
- should add a new proposal
- should emit ProposalRegistered event
- should revert 'empty proposal description string'
- should revert 'workflowstatus not ProposalsRegistrationStarted'
# 5 - SetVote function

### **5 tests**
- should set a vote
- should emit Voted event
- should revert 'voter already voted'
- should revert 'proposal doesn't exist'
- should revert 'workflowstatus not VotingSessionStarted'

# 6 - Status Function

### **20 tests**
- should not start Proposals Registering if not called by owner
- should emit WorkflowStatusChange event to ProposalsRegistrationStarted
- should change workflow status to ProposalsRegistrationStarted
- should revert 'workflowstatus not RegisteringVoters'
- should not end Proposals Registering if not called by owner
- should emit WorkflowStatusChange event to ProposalsRegistrationEnded
- should change workflow status to ProposalsRegistrationEnded
- should revert 'workflowstatus not RegisteringVoters'
- should not start Voting Session if not called by owner
- should emit WorkflowStatusChange event to VotingSessionStarted
- should change workflow status to VotingSessionStarted
- should revert 'workflowstatus not ProposalsRegistrationEnded'
- should revert 'workflowstatus not VotingSessionEnded'
- should not end Voting Session if not called by owner
- should emit WorkflowStatusChange event to VotingSessionEnded
- should change workflow status to VotingSessionEnded
- should revert 'workflowstatus not VotingSessionStarted'
- should not start tally if not called by owner
- should emit WorkflowStatusChange event to VotesTallied
- should change workflow status to VotesTallied

# 7 - TallyVotes Function
### **1 tests**
 - should find the winningProposalId
