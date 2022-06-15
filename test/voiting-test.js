const { inputToConfig } = require("@ethereum-waffle/compiler");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let owner, candidate1, candidate2, candidate3, voter1, voter2, voter3, voting;
  
  beforeEach(async function () {
    [owner, candidate1, candidate2, candidate3, voter1, voter2, voter3] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("VotingContract", owner);
    voting = await Voting.deploy();
    await voting.deployed();
  });

  it("Sets owner", async function() {
    const currentOwner = await voting.owner();
    expect(currentOwner).to.eq(owner.address);
  });

  describe("Function - addVoting", function () {
    it("Creates voting correctly", async function() {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      expect(await voting.viewCandidates(0)).to.have.all.members([candidate1.address, candidate2.address, candidate3.address]);
    });
    it("Only the owner can create a voting", async function () {
      expect(voting.connect(voter1).addVoting([candidate1.address, candidate2.address, candidate3.address])).to.be.revertedWith("Sorry, u not owner.");
    });
  });

  describe("Function - vote", async function () {
    it("The function allows you to vote for the selected candidate, in the selected voting, while paying 0.01 ETH", async function () {
        await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
        await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
        expect(await voting.viewWhoVoted(0, voter1.address)).to.be.equal(true)
    });
    it("You must pay exactly 0.01 ETH", async function () {
        await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
        await expect(voting.vote(0, 2, {value: ethers.utils.parseEther("0.02") })).to.be.revertedWith("You must pay exactly 0.01 ETH");   
    });
    it("You must select an existing vote", async function () {
        await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
        await expect(voting.vote(1, 0, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith("There is no such vote.");
    });
    it("You can only vote once", async function () {
        await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
        await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
        await expect(voting.connect(voter1).vote(0, 1, {value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("You have already voted.");
    });
    it("You must select an existing candidate", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await expect(voting.vote(0, 3, {value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("Unknown candidate.");
    });
    it("The selected vote must not be completed", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);
      await voting.finishVoting(0);
      await expect(voting.vote(0, 2, {value: ethers.utils.parseEther("0.01") })).to.be.revertedWith("Voting is over.");
    });
  });

  describe("Function - finishVoting", async function () {
    it("You can end voting in 3 days", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);
      await voting.finishVoting(0);
    });
    it("You must select an existing vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);
      expect(voting.finishVoting(1)).to.be.revertedWith("There is no such vote.");
    });
    it("The selected vote must not be completed", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});

      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);

      await voting.finishVoting(0);

      expect(voting.finishVoting(0)).to.be.revertedWith("Voting is over.");
    });
    it("Voting can be completed no earlier than 3 days later", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      expect(voting.finishVoting(0)).to.be.revertedWith("Voting is not over yet");
    });
  });

  describe("Function - viewCandidates", async function () {
    it("Shows the list of candidates in the selected vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      expect(await voting.viewCandidates(0)).to.have.all.members([candidate1.address, candidate2.address, candidate3.address]);
    });
    it("You must select an existing vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await expect(voting.viewCandidates(1)).to.be.revertedWith("There is no such vote."); 
    });
  });

  describe("Function - viewWhoVoted", async function () {
    it("Shows whether the person participated in the selected vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      expect(await voting.viewWhoVoted(0, voter1.address)).to.be.eq(true)
    });
    it("You must select an existing vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      await expect(voting.viewWhoVoted(1, voter1.address)).to.be.revertedWith("There is no such vote."); 
    });
  });
  
  describe("Function - viewAmountVotes", async function () {
    it("Shows the number of votes for the candidate in the selected vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      expect(await voting.viewAmountVotes(0, 2)).to.be.eq(1)
    });
    it("You must select an existing vote", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      expect(voting.viewAmountVotes(1, 2)).to.be.revertedWith("There is no such vote."); 
    });
    it("You must select an existing candidate", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      expect(voting.viewAmountVotes(0, 3)).to.be.revertedWith("Unknown candidate.");
    });
  });

  describe("Function - votings", async function () {
    it("Learn more about voting", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.votings(0);
    });
  });

  describe("Function - withdraw", async function () {
    it("Withdrawal of money to the owner account", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);
      await voting.finishVoting(0);
      await voting.withdraw(ethers.utils.parseEther("0.001"))
    });
    it("If the owner wants to withdraw more money than is on the contract", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);
      await voting.finishVoting(0);
      expect(voting.withdraw(ethers.utils.parseEther("0.01"))).to.be.revertedWith("Not enough currency.");
    });
    it("Only the owner can withdraw money", async function () {
      await voting.addVoting([candidate1.address, candidate2.address, candidate3.address]);
      await voting.connect(voter1).vote(0, 2, {value: ethers.utils.parseEther("0.01")});
      await ethers.provider.send("evm_increaseTime", [300000]);
      await ethers.provider.send("evm_mine", []);
      await voting.finishVoting(0);
      expect(voting.connect(voter1).withdraw(ethers.utils.parseEther("0.001"))).to.be.revertedWith("Sorry, u not owner.");
    });
  });
});
