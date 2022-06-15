const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

task("viewCandidates", "View candidates in the selected voting")
    .addParam("votingId", "Voting number")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();   
        const Voting = await new hre.ethers.Contract(contractAddress, metadata.abi, owner);
        
        try {
            await Voting.viewCandidates(taskArgs.votingId);
        }
        catch (err) {
            console.log(err.error);
        }

        console.log(`List of candidates in the selected vote ${taskArgs.votingId}`);
})