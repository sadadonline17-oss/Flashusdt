require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Robust Private Key Parser
 * Ensures the key starts with 0x and is valid.
 */
const getAccounts = () => {
  const key = process.env.PRIVATE_KEY;
  if (!key) return [];

  // Remove spaces and ensure 0x prefix
  const cleanKey = key.trim();
  const formattedKey = cleanKey.startsWith("0x") ? cleanKey : `0x${cleanKey}`;

  // Validate length (0x + 64 hex chars = 66)
  if (formattedKey.length !== 66) {
    console.warn("Warning: PRIVATE_KEY detected but appears to be invalid length.");
    return [];
  }
  return [formattedKey];
};

const accounts = getAccounts();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      // Primary RPC from env, with multiple public fallbacks
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.ankr.com/eth_sepolia",
      accounts: accounts,
    },
    bsc: {
      url: process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/",
      accounts: accounts,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: accounts,
    },
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: accounts,
    }
  },
  mocha: {
    timeout: 40000
  }
};
