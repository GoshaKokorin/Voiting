const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');

task("withdraw", "Withdraw commission")
    .addParam("amount", "Amount wei to withdraw")
    .setAction(async (taskArgs, hre) => {
        const [owner] = await hre.ethers.getSigners();   
        const Voting = await new hre.ethers.Contract("address", metadata.abi, owner);
        
        try {
            await Voting.withdraw(taskArgs.amount);
        }
        catch (err) {
            console.log(err.error);
        }
        
        console.log(`Commission in the amount of ${taskArgs.amount} wei has been successfully withdrawn to your address!`);
})