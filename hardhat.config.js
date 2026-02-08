require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Simple validation to ensure the private key is a valid 64-character hex string (with or without 0x)
const isValidPrivateKey = (key) => {
  if (!key) return false;
  const cleanKey = key.startsWith("0x") ? key.slice(2) : key;
  return /^[0-9a-fA-F]{64}$/.test(cleanKey);
};

const accounts = isValidPrivateKey(PRIVATE_KEY) ? [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`] : [];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org",
      accounts: accounts,
    },
  },
};
