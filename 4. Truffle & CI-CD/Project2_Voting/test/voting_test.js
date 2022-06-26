const Voting = artifacts.require("./Voting.sol");

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

contract("Voting", function (accounts ) {

    // Test of the getVoter Function

    // Test of the getOneProposal Function

    // Test of the addVoter Function

    // Test of the addProposal Function
    
    // Test of the setVote Function

    // Test of the startProposalsRegistering Function

    // Test of the endProposalsRegistering Function

    // Test of the startVotingSession Function

    // Test of the endVotingSession Function

    // Test of the tallyVotes Function

})