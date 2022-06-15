//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    address public owner;
    uint transferFee;
    uint constant DURATION = 3 days; 
    uint constant COMISSION = 0.01 ether;

    struct Voting {
        address[] candidates;
        mapping (uint=>uint) amountVotes;
        mapping (address=>bool) whoVoted;
        uint maxVotes;
        uint winnerId;
        uint amountMoney;
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

    function addVoting(address[] memory _candidates) external onlyOwner {
        Voting storage newVoting = votings.push();
        newVoting.candidates = _candidates;
        newVoting.endVotingTime = block.timestamp + DURATION;
    }

    function viewCandidates(uint votingId) external view returns(address[] memory) {
        require(votingId < votings.length, "There is no such vote.");
        Voting storage voting = votings[votingId];
        return voting.candidates;
    }

    function viewAmountVotes(uint votingId, uint candidateId) external view returns(uint) {
        require(votingId < votings.length, "There is no such vote.");
        Voting storage voting = votings[votingId];
        require(candidateId < voting.candidates.length, "Unknown candidate.");
        return voting.amountVotes[candidateId];
    }

    function viewWhoVoted(uint votingId, address _whoVoted) external view returns(bool) {
        require(votingId < votings.length, "There is no such vote.");
        Voting storage voting = votings[votingId];
        return voting.whoVoted[_whoVoted];
    }

    function vote(uint votingId, uint candidateId) external payable {
        require(msg.value == COMISSION, "You must pay exactly 0.01 ETH");
        require(votingId < votings.length, "There is no such vote.");
        Voting storage voting = votings[votingId];
        require(!voting.whoVoted[msg.sender], "You have already voted.");
        require(candidateId < voting.candidates.length, "Unknown candidate.");
        require(!voting.ended, "Voting is over.");

        voting.amountMoney += COMISSION;
        voting.amountVotes[candidateId] += 1;
        voting.whoVoted[msg.sender] = true;

        if (voting.amountVotes[candidateId] > voting.maxVotes) {
            voting.maxVotes = voting.amountVotes[candidateId];
            voting.winnerId = candidateId;
        }
    }

    function finishVoting(uint votingId) external payable {
        require(votingId < votings.length, "There is no such vote.");
        
        Voting storage voting = votings[votingId];
        require(!voting.ended, "Voting is over.");
        require(block.timestamp > voting.endVotingTime, "Voting is not over yet");
        voting.ended = true;
        
        transferFee += voting.amountMoney / 10;
        voting.amountMoney -= voting.amountMoney * 90 / 100;
        payable(voting.candidates[voting.winnerId]).transfer(voting.amountMoney);
    }

    function withdraw(uint amount) external payable onlyOwner {
        require(amount <= transferFee, "Not enough currency.");
        transferFee -= amount;
        payable(msg.sender).transfer(amount);
    }
}

// ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"]
// 10000000000000000