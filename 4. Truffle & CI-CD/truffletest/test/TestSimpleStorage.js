// SPDX-License-Identifier: GPL-3.0
// pragma solidity 0.8.13;
 
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');
const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", accounts => {

 it("...should store the value 89.", async () => {

  const simpleStorageInstance = await SimpleStorage.deployed();

  // Set value of 89

  await simpleStorageInstance.set(89, { from: accounts[0] });

  // Get stored value

  const storedData = await simpleStorageInstance.get.call();

  assert.equal(storedData, 89, "The value 89 was not stored.");

 });

 it("reverts when the value is 12", async () => {

    const simpleStorageInstance = await SimpleStorage.deployed();
  
    // Set value of 89
  
    await expectRevert(
    simpleStorageInstance.set(12, { from: accounts[0] }),"12 is fordbidden",
  
   )});

   it('emits a n in event', async function () {
    const simpleStorageInstance = await SimpleStorage.deployed();

    const receipt = await simpleStorageInstance.set(89, { from: accounts[0] });

    // Event assertions can verify that the arguments are the expected ones
    expectEvent(receipt, 'Uset', 89);
  });

});
