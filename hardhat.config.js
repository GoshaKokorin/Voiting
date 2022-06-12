require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("@nomiclabs/hardhat-web3");

// Tasks

// const addVoting = require("./tasks/addVoting")
// const payForVoting = require("./tasks/payForVoting")
// const viewVoting = require("./tasks/viewVoting")
// const vote = require("./tasks/vote")
// const withdraw = require("./tasks/withdraw")

// addVoting();
// payForVoting();
// viewVoting();
// vote();
// withdraw();

// const ALCHEMY_API_KEY = process.env.ALCHEMY;
// const RINKEBY_PRIVATE_KEY = process.env.RINKEBY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  // networks: {
  //   rinkeby: {
  //     url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
  //     accounts: [`${RINKEBY_PRIVATE_KEY}`]
  //   }
  // }
};
