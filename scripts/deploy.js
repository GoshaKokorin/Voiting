async function main() {
  const [owner] = await ethers.getSigners()
  console.log("Deploying contracts with the account:", owner.address)
  const Voting = await ethers.getContractFactory("Voting", owner)
  const voting = await Voting.deploy()
  await voting.deployed()
  console.log("Donation deployed to:", voting.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });