require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require('solidity-coverage');
require("@nomiclabs/hardhat-web3");
require("./tasks")

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
  // },
  // defaultNetwork: "rinkeby"
};