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
        uint[] amountVotes;
        address[] whoVoted;
        uint amountMoney;
        uint startVotingTime;
        uint endVotingTime;
        bool ended;
    }

    Voting[] public votings;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() { 
    require(msg.sender == owner, "Sorry, u not owner."); 
    _;
    }

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
        amountVotes: votes1,
        whoVoted: _candidates,
        amountMoney: 0,
        startVotingTime: block.timestamp,
        endVotingTime: block.timestamp + DURATION,
        ended: false
      });

      votings.push(newVoting);
    }

    function viewVoting(uint votingId) external view returns(Voting memory) {
        require(votingId < votings.length, "There is no such vote.");
        return votings[votingId];
    }

    // TODO: Проверить количество средств у покупателя
    function vote(uint votingId, uint voterId) external {
        require(votingId < votings.length, "There is no such vote.");
        require(participants[msg.sender] < 100000000000000000, "Insufficient funds.");
        Voting storage voting = votings[votingId];
        require(voterId < voting.candidates.length, "Unknown candidate.");
        require(!voting.ended, "Voting is over.");

        bool voted = false;
        for (uint i = 0; i < voting.whoVoted.length; i++) {
            if (msg.sender == voting.whoVoted[i]) {
                voted = true;
            }
        }
        require(!voted, "You have already voted.");

        participants[msg.sender] -= 100000000000000000;                      
        voting.amountMoney += 100000000000000000;

        voting.amountVotes[voterId] += 1;
        voting.whoVoted.push(msg.sender);
    }

    function finishVoting(uint votingId) external payable {
        require(votingId < votings.length, "There is no such vote.");

        Voting storage voting = votings[votingId];
        require(block.timestamp > voting.endVotingTime, "Voting is not over yet");
        voting.ended = true;
        // TODO: сделать подсчет победителя, при равных голосах
        uint winner;
        uint maxVotes = voting.amountVotes[0];

        for (uint i = 1; i < voting.amountVotes.length; i++) {
            if (voting.amountVotes[i] > maxVotes) {
                winner = i;
                maxVotes = voting.amountVotes[i];
            }
        }
        
        comission += voting.amountMoney / 10;
        voting.amountMoney -= voting.amountMoney * 90 / 100;
        payable(voting.candidates[winner]).transfer(voting.amountMoney);
    }

    function withdraw(uint amount) external payable onlyOwner {
        require(amount <= comission, "Not enough currency.");
        comission -= amount; 
        payable(msg.sender).transfer(amount);
    }
}

// ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]