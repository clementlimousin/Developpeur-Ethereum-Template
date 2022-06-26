const Voting = artifacts.require("./Voting.sol");

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

contract("Voting", function (accounts ) {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];
    let votingInstance

    // Test of the getVoter Function
    describe('Test of the getVoter Function', function () {;

        // Creation of a votingInstance and add a voter
        before(async function () {
          votingInstance = await Voting.new({from: owner});
          await votingInstance.addVoter(user1, {from: owner});
        });
    
        it("should revert 'caller is not a voter'", async function() {
          const getVoter = votingInstance.getVoter.call(user1,{ from: user2 });
          expectRevert(getVoter, "You're not a voter");
        });
    
        it("should return an empty value", async function() {
          const voter = await votingInstance.getVoter.call(user2, {from:user1});
          expect(voter.isRegistered).to.be.equal(false, "error isRegistered state");
        });
    
        it("should return a registered voter", async function() {
          const voter = await votingInstance.getVoter.call(user1, {from:user1});
          expect(voter.isRegistered).to.be.equal(true, "error isRegistered state");
        });
      });

    // Test of the getOneProposal Function
    describe('Test of the getOneProposal Function', function () {;
        const proposalDescription = "Dog";
        
        // Creation of a votingInstance
        before(async function () {
          votingInstance = await Voting.new({from: owner});
          //add user1 as voter
          await votingInstance.addVoter(user1, {from: owner});
          // start proposal registration
          await votingInstance.startProposalsRegistering({from: owner});
          // add a proposal from user1
          await votingInstance.addProposal(proposalDescription, {from: user1});
        });
    
        it("should revert 'caller is not a voter'", async function() {
          const getOneProposal = votingInstance.getOneProposal.call(0,{ from: user2 });
          expectRevert(getOneProposal, "You're not a voter");
        });
    
        it("should revert an unspecified proposal", async function() {
          const getOneProposal = votingInstance.getOneProposal.call(1, {from:user1});
          expectRevert.unspecified(getOneProposal);
        });
    
        it("should return an existing proposal with the correct description", async function() {
          const proposal = await votingInstance.getOneProposal.call(0, {from:user1});
          expect(proposal.description).to.be.a('string').equal(proposalDescription);
        });
    
        it("should return an existing proposal with the correct voteCount", async function() {
          const proposal = await votingInstance.getOneProposal.call(0, {from:user1});
          assert.equal(proposal.voteCount, 0, "voteCount not 0");
        });
      });

    // Test of the addVoter Function
    describe('Test of the addVoter Function', function () {;
    
        // Creation of a votingInstance
        before(async function () {
          votingInstance = await Voting.new({from: owner});
        });
    
        it("should add user1 as voter and emit event", async function() {
          const addVoter = await votingInstance.addVoter(user1, {from: owner});
          expectEvent(addVoter, "VoterRegistered", {voterAddress: user1});
        });
    
        it("should revert 'voter already registered'", async function() {
          const addVoterAlready = votingInstance.addVoter(user1, {from: owner});
          expectRevert(addVoterAlready, "Already registered");
        });
    
        it("should revert 'caller is not the owner'", async function() {
          const addVoterNotOwner = votingInstance.addVoter.call(user1,{ from: user2 });
          expectRevert(addVoterNotOwner, "Ownable: caller is not the owner");
        });
    
        it("should revert 'workflowstatus not RegisteringVoters'", async function() {
          votingInstance.startProposalsRegistering({from: owner});
          const addVoterRevert = votingInstance.addVoter(user2, {from: owner});
          expectRevert(addVoterRevert, "Voters registration is not open yet");
        });
      });

    // Test of the addProposal Function
    describe('Test of the addProposal Function', function () {
        let proposalDescription = 'Dog';

        // Creation of a votingInstance
        before(async function () {
            votingInstance = await Voting.new({from: owner});
            await votingInstance.addVoter(user1, {from: owner});
            await votingInstance.startProposalsRegistering({from: owner});
          });

        it("should add a new proposal", async function() {
          await votingInstance.addProposal(proposalDescription, {from: user1});     
          const proposal = await votingInstance.getOneProposal.call(0, {from:user1});
          expect(proposal.description).to.be.a('string').equal(proposalDescription);
        });    
    
        it("should emit ProposalRegistered event", async function() {
          const proposalEmit = await votingInstance.addProposal(proposalDescription, {from: user1});
          expectEvent(proposalEmit, "ProposalRegistered", { proposalId: new BN(1) });
        });
    
        it("should revert 'empty proposal description string'", async function() {;
          const proposalEmpty = votingInstance.addProposal("", {from: user1});
          expectRevert(proposalEmpty, "Vous ne pouvez pas ne rien proposer");
        });

        it("should revert 'workflowstatus not ProposalsRegistrationStarted'", async function() {
            await votingInstance.endProposalsRegistering({from: owner});
            const proposalRevert = votingInstance.addProposal(proposalDescription, {from: user1});
            expectRevert(proposalRevert, "Proposals are not allowed yet");
          });
      });
    
    
    // Test of the setVote Function

    describe('setVote', function () {
        let proposalDescription = 'Dog';

        // Creation of a votingInstance
        before(async function () {
            votingInstance = await Voting.new({from: owner});
            await votingInstance.addVoter(user1, {from: owner});
            await votingInstance.addVoter(user2, {from: owner});
            await votingInstance.addVoter(user3, {from: owner});
            await votingInstance.addVoter(user4, {from: owner});
            await votingInstance.startProposalsRegistering({from: owner});
            await votingInstance.addProposal(proposalDescription, {from: user1});
            await votingInstance.endProposalsRegistering({from: owner}); 
            await votingInstance.startVotingSession({from: owner});   
          });

        it("should set a vote", async function() {
          await votingInstance.setVote(0, {from: user1});   
          const voter = await votingInstance.getVoter.call(user1, {from:user1});
          const proposal = await votingInstance.getOneProposal.call(0, {from:user1});
          expect(new BN(voter.votedProposalId)).to.be.bignumber.equal(new BN(0));
          assert.equal(voter.hasVoted, true, "The hasVoted property should be true");
          expect(new BN(proposal.voteCount)).to.be.bignumber.equal(new BN(1));
        }); 
    
        it("should emit Voted event", async function() {
          const setVoteEvent= await votingInstance.setVote(0, {from: user2});
          // test
          expectEvent(setVoteEvent, "Voted", { 
            voter: user2, 
            proposalId: new BN(0)
          });
        });
    
        it("should revert 'voter already voted'", async function() { 
          const setVoteAlready = votingInstance.setVote(0, {from: user1});
          expectRevert(setVoteAlready, "You have already voted");
        });
        
        it("should revert 'proposal doesn't exist'", async function() {    
          const setVoteNotExist = votingInstance.setVote(3, {from: user3});
          expectRevert(setVoteNotExist, "Proposal not found");
        });

        it("should revert 'workflowstatus not VotingSessionStarted'", async function() {
            await votingInstance.endVotingSession({from: owner});       
            const setVoteForbidden = votingInstance.setVote(0, {from: user4});
            expectRevert(setVoteForbidden, "Voting session havent started yet");
          });
      });
      // Test of the status Function
    describe('Test of the status Function', function () {

        // Creation of a votingInstance
        before(async function () {
            votingInstance = await Voting.new({from: owner});
          });

        // startProposalsRegistering
        it("should change workflow status to ProposalsRegistrationStarted and emit an event", async function() {
          const changeStatusStartProposals = await votingInstance.startProposalsRegistering({from: owner});   
          const currentStatusStartProposals = await votingInstance.workflowStatus();
          expect(currentStatusStartProposals.toString()).to.equal(Voting.WorkflowStatus.ProposalsRegistrationStarted.toString());
          expectEvent(changeStatusStartProposals, "WorkflowStatusChange", { 
            previousStatus: Voting.WorkflowStatus.RegisteringVoters.toString(), 
            newStatus: Voting.WorkflowStatus.ProposalsRegistrationStarted.toString() 
          });
        });
    
        it("should revert 'workflowstatus not RegisteringVoters'", async function() {  
          const revertStartProposals = votingInstance.startProposalsRegistering({from: owner});
          expectRevert(revertStartProposals, "Registering proposals cant be started now");
        });

        // endProposalsRegistering
        it("should change workflow status to ProposalsRegistrationEnded and emit an event", async function() {
            const changeStatusEndProposals = await votingInstance.endProposalsRegistering({from: owner});   
            const currentStatusEndProposals = await votingInstance.workflowStatus();
            expect(currentStatusEndProposals.toString()).to.equal(Voting.WorkflowStatus.ProposalsRegistrationEnded.toString());
            expectEvent(changeStatusEndProposals, "WorkflowStatusChange", { 
              previousStatus: Voting.WorkflowStatus.ProposalsRegistrationStarted.toString(), 
              newStatus: Voting.WorkflowStatus.ProposalsRegistrationEnded.toString() 
            });
          });
      
        it("should revert 'workflowstatus not RegisteringVoters'", async function() {
            const revertEndProposals = votingInstance.endProposalsRegistering({from: owner});
            expectRevert(revertEndProposals, "Registering proposals havent started yet");
          });

        // startVotingSession
        it("should change workflow status to VotingSessionStarted and emit an event", async function() {
            const changeStatusStartVoting = await votingInstance.startVotingSession({from: owner});
            const currentStatusStartVoting = await votingInstance.workflowStatus();
            expect(currentStatusStartVoting.toString()).to.equal(Voting.WorkflowStatus.VotingSessionStarted.toString());
            expectEvent(changeStatusStartVoting, "WorkflowStatusChange", { 
              previousStatus: Voting.WorkflowStatus.ProposalsRegistrationEnded.toString(), 
              newStatus: Voting.WorkflowStatus.VotingSessionStarted.toString() 
            });
          });
      
        it("should revert 'workflowstatus not ProposalsRegistrationEnded'", async function() {
            let revertStartVoting = votingInstance.startVotingSession({from: owner});
            expectRevert(revertStartVoting, "Registering proposals phase is not finished");
          });
        
        // endVotingSession
        it("should change workflow status to VotingSessionEnded and emit an event", async function() {
            const changeStatusEndVoting = await votingInstance.endVotingSession({from: owner});
            const currentStatusEndVoting = await votingInstance.workflowStatus();
            expect(currentStatusEndVoting.toString()).to.equal(Voting.WorkflowStatus.VotingSessionEnded.toString());
            expectEvent(changeStatusEndVoting, "WorkflowStatusChange", { 
              previousStatus: Voting.WorkflowStatus.VotingSessionStarted.toString(), 
              newStatus: Voting.WorkflowStatus.VotingSessionEnded.toString() 
            });
          });
  
        it("should revert (workflowstatus not VotingSessionStarted)", async function() {
            const revertEndVoting = votingInstance.endVotingSession({from: owner});
            expectRevert(revertEndVoting, "Voting session havent started yet");
          });
      });

    // Test of the tallyVotes Function
})