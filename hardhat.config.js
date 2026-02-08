require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Helper to get environment variable or fallback, with trimming.
 * If the environment variable is an empty string or only whitespace, it returns the fallback.
 */
const getEnv = (name, fallback = "") => {
  const value = process.env[name];
  if (value && typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  return fallback;
};

const rawPrivateKey = getEnv("PRIVATE_KEY");

/**
 * Simple validation to ensure the private key is a valid 64-character hex string (with or without 0x)
 */
const isValidPrivateKey = (key) => {
  if (!key) return false;
  const cleanKey = key.startsWith("0x") ? key.slice(2) : key;
  return /^[0-9a-fA-F]{64}$/.test(cleanKey);
};

const accounts = isValidPrivateKey(rawPrivateKey)
  ? [rawPrivateKey.startsWith("0x") ? rawPrivateKey : `0x${rawPrivateKey}`]
  : [];

if (process.env.NODE_ENV !== 'test' && accounts.length === 0 && process.env.PRIVATE_KEY) {
    console.warn("WARNING: PRIVATE_KEY was provided but appears to be invalid. It must be a 64-character hex string.");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: getEnv("SEPOLIA_RPC_URL", "https://rpc.sepolia.org"),
      accounts: accounts,
    },
    bsc: {
      url: getEnv("BSC_RPC_URL", "https://bsc-dataseed.binance.org/"),
      accounts: accounts,
    },
    polygon: {
      url: getEnv("POLYGON_RPC_URL", "https://polygon-rpc.com"),
      accounts: accounts,
    },
    base: {
      url: getEnv("BASE_RPC_URL", "https://mainnet.base.org"),
      accounts: accounts,
    }
  },
};
