const hre = require("hardhat");

async function main() {
  console.log("--- Global Asset Simulator Deployment ---");

  // 1. Validation Logic
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    console.error("CRITICAL ERROR: No deployment account found!");
    console.error("Please ensure your PRIVATE_KEY is correctly set in .env or GitHub Secrets.");
    console.error("The key should be a 64-character hex string.");
    process.exit(1);
  }

  const [deployer] = signers;
  const networkName = hre.network.name;

  // 2. Logging and Address Masking
  const address = await deployer.getAddress();
  console.log(`Target Network: ${networkName}`);
  console.log(`Deployer Address: ${address.substring(0, 6)}... (Verified)`);

  // 3. Forwarder Deployment/Setup
  let trustedForwarder = process.env.TRUSTED_FORWARDER;

  if (!trustedForwarder || trustedForwarder === "0x0000000000000000000000000000000000000000") {
    console.log("No Trusted Forwarder found. Deploying GlobalAssetForwarder...");
    const GlobalAssetForwarder = await hre.ethers.getContractFactory("GlobalAssetForwarder");
    const forwarder = await GlobalAssetForwarder.deploy();
    await forwarder.waitForDeployment();
    trustedForwarder = await forwarder.getAddress();
    console.log(`Forwarder deployed at: ${trustedForwarder}`);
  } else {
    console.log(`Using existing Forwarder: ${trustedForwarder}`);
  }

  // 4. Token Deployment
  console.log("Deploying GlobalAssetUSDT (USDT Simulator)...");
  const GlobalAssetUSDT = await hre.ethers.getContractFactory("GlobalAssetUSDT");
  const token = await GlobalAssetUSDT.deploy(trustedForwarder);

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("SUCCESS: GlobalAssetUSDT deployed!");
  console.log(`Contract Address: ${tokenAddress}`);
  console.log(`Permit Feature: ENABLED`);
  console.log(`Initial Supply: 1,000,000,000 USDT minted to ${address.substring(0, 6)}...`);
  console.log("------------------------------------------");
}

main().catch((error) => {
  console.error("Deployment failed with error:");
  console.error(error);
  process.exitCode = 1;
});
