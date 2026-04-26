require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  // Tenderly Configuration
  tenderly: {
    project: process.env.TENDERLY_PROJECT || "vaccine-shipment-tracker",
    username: process.env.TENDERLY_USERNAME || "your-username",
    networkId: parseInt(process.env.TENDERLY_NETWORK_ID) || 11155111, // Sepolia
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || process.env.ALCHEMY_SEPOLIA_URL || "https://sepolia.infura.io/v3/placeholder",
      accounts: process.env.SEPOLIA_PRIVATE_KEY ? [process.env.SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};