const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

task("finishVoting", "Finish voting")
    .addParam("votingId", "Voting number")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();   
        const Voting = await new hre.ethers.Contract(contractAddress, metadata.abi, owner);
        
        try {
            await Voting.finishVoting(taskArgs.votingId);
        }
        catch (err) {
            console.log(err.error);
        }

        console.log(`Voting ${taskArgs.votingId} has ended `);
})