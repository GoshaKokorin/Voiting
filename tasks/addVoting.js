// const metadata = require('../artifacts/contracts/Voting.sol/VotingContract.json');

// task("createVoting", "Create new voting with given addresses as candidates")
//     .addParam('addresses', 'Enter a list of candidates')
//     .setAction(async (taskArgs, hre) => {
//         const [owner] = await hre.ethers.getSigners();
//         const Voting = await new hre.ethers.Contract("address", metadata.abi, owner);

//         let addresses = taskArgs.addresses.split(" ");

//         try {
//             await VotingContract.CreateVoting(addresses);
//         }
//         catch (err) {
//             console.error("An error has occurred!");
//         }

//         console.log(`Created a vote with these candidates ${addresses}`);
// })