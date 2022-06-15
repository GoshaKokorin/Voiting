const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

task("vote", "Vote for a candidate")
    .addParam("votingId", "Voting number")
    .addParam("candidateId", "Сandidate number")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();   
        const Voting = await new hre.ethers.Contract(contractAddress, metadata.abi, owner);
        
        try {
            await Voting.vote(taskArgs.votingId, taskArgs.candidateId, {value: ethers.utils.parseEther("0.01")});
        }
        catch (err) {
            console.log(err.error);
        }

        console.log(`You voted for a candidate ${taskArgs.candidateId} in the voting ${taskArgs.votingId}`);
})