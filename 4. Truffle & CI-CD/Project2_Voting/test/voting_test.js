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

    // Test of the getVoter Function
    describe('Test of the getVoter Function', function () {
        let votingInstance;

    
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
    describe('Test of the getOneProposal Function', function () {
        let votingInstance;
        const proposalDescription = "Dog";
    
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

    // Test of the addProposal Function
    
    // Test of the setVote Function

    // Test of the startProposalsRegistering Function

    // Test of the endProposalsRegistering Function

    // Test of the startVotingSession Function

    // Test of the endVotingSession Function

    // Test of the tallyVotes Function

})