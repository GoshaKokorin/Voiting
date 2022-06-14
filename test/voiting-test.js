const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let owner, candidate1, candidate2, candidate3, voter1, voter2, voter3;

  beforeEach(async function () {
    [owner, candidate1, candidate2, candidate3, voter1, voter2, voter3] = await ethers.getSigners()

    const Voting = await ethers.getContractFactory("Voting", owner)
    const voting = await Voting.deploy()
    await voting.deployed()
  })

  // it("Sets owner", async function() {
  //   const currentOwner = await voting.owner()
  //   expect(currentOwner).to.eq(owner.address)
  // })

  // describe("addVoting", function () {
  //   it("creates voting correctly", async function() {
  //     await Voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
  //   })
  // })


});