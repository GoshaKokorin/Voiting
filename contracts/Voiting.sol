//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    // TODO: убрать костыль с votes1
    uint[] votes1;

    address owner;
    uint comission;
    uint constant DURATION = 3 days; 
    mapping(address=>uint) participants;

    struct Voting {
        address[] candidates;
        uint[] votes;
        uint startVotingTime;
        uint endVotingTime;
        bool ended;
    }

    Voting[] public votings;

    event StartVoting();
    event EndVoting();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() { 
    require(msg.sender == owner, "Sorry, u not owner."); 
    _;
    }

    // TODO: сделать
    // modifier actualVoting() { 
    // require(msg.sender == owner, "Sorry, u not owner."); 
    // _;
    // }

    function payForVoting() external payable {
        require(msg.value > 0, "Pay must be greater than 0.");
        participants[msg.sender] += msg.value;
    }

    function addVoting(address[] memory _candidates) external onlyOwner {
      // TODO: убрать костыль с votes1
      for (uint i = 0; i < _candidates.length; i++)
        {
            votes1.push(0);
        }

      Voting memory newVoting = Voting({
        candidates: _candidates,
        votes: votes1,
        startVotingTime: block.timestamp,
        endVotingTime: block.timestamp + DURATION,
        ended: false
      });

      votings.push(newVoting);

      emit StartVoting();
    }

    function viewVoting(uint votingId) external view returns(Voting memory) {
        require(votingId < votings.length, "There is no such vote.");
        return votings[votingId];
    }


    function vote(uint votingId, uint voterId) external {
        require(votingId < votings.length, "There is no such vote.");
        require(participants[msg.sender] >= 10000000000000000, "Insufficient funds.");

        Voting storage voting = votings[votingId];

        


    }

    function finishVoting() external payable {}

    function withdraw(uint amount) external payable onlyOwner {
        require(amount <= comission, "Not enough currency.");
        comission -= amount; 
        payable(msg.sender).transfer(amount);
    }
}


// 3 day in seconds = 259200
// ethers.utils.parseEther("0.01")