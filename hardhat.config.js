import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    amoy: {
      url: process.env.AMOY_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
  }
};

export default config;
