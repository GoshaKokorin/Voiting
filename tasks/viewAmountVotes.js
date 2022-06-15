const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

task("viewAmountVotes", "View the number of votes for the selected candidate")
    .addParam("votingId", "Voting number")
    .addParam("candidateId", "Сandidate number")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();   
        const Voting = await new hre.ethers.Contract(contractAddress, metadata.abi, owner);
        
        try {
            await Voting.viewAmountVotes(taskArgs.votingId, taskArgs.candidateId);
        }
        catch (err) {
            console.log(err.error);
        }

        console.log(`View the number of votes for candidate ${taskArgs.candidateId}`);
})