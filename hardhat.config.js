require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Helper to get environment variable or fallback, with trimming.
 */
const getEnv = (name, fallback = "") => {
  const value = process.env[name];
  if (value && typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  return fallback;
};

/**
 * Robustly sanitizes a private key.
 * 1. Trims whitespace and surrounding quotes.
 * 2. Handles 0x prefix.
 * 3. Fallback: If the key is not a valid 64-char hex but looks like base64, attempts to decode it.
 */
const sanitizePrivateKey = (key) => {
  if (!key || typeof key !== 'string') return "";

  let cleanKey = key.trim().replace(/^["']|["']$/g, "").trim();

  // If it's already a valid 64-char hex (with or without 0x)
  const hexPattern = /^(0x)?[0-9a-fA-F]{64}$/;
  if (hexPattern.test(cleanKey)) {
    return cleanKey.startsWith("0x") ? cleanKey : `0x${cleanKey}`;
  }

  // Fallback for non-standard formats (like the 128-char base64 string provided)
  // We check if it looks like base64 and not hex
  if (cleanKey.length > 66 && /^[A-Za-z0-9+/=]+$/.test(cleanKey)) {
    try {
      const buf = Buffer.from(cleanKey, 'base64');
      if (buf.length >= 32) {
        // Take the first 32 bytes as the private key
        const hex = buf.toString('hex').slice(0, 64);
        return `0x${hex}`;
      }
    } catch (e) {
      // Ignore errors and return original for Hardhat to handle
    }
  }

  return cleanKey.startsWith("0x") ? cleanKey : `0x${cleanKey}`;
};

const rawPrivateKey = getEnv("PRIVATE_KEY");
const sanitizedKey = sanitizePrivateKey(rawPrivateKey);

const accounts = sanitizedKey && sanitizedKey.length >= 66 ? [sanitizedKey] : [];

if (process.env.NODE_ENV !== 'test' && accounts.length === 0 && rawPrivateKey) {
    console.warn("WARNING: PRIVATE_KEY was provided but appears to be invalid for an Ethereum account.");
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
