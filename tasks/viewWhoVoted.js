const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');
const contractAddress = process.env.CONTRACT_ADDRESS;

task("viewWhoVoted", "Find out whether a member voted or not")
    .addParam("votingId", "Voting number")
    .addParam("whoVoted", "Participant address")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();   
        const Voting = await new hre.ethers.Contract(contractAddress, metadata.abi, owner);
        
        try {
            await Voting.viewWhoVoted(taskArgs.votingId, taskArgs.whoVoted);
        }
        catch (err) {
            console.log(err.error);
        }

        console.log(`Whether the person ${taskArgs.whoVoted} voted or not in this vote ${taskArgs.votingId}`);
})