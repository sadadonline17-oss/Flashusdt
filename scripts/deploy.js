const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No deployment account found. Please check your PRIVATE_KEY in .env or GitHub Secrets.");
  }
  const [deployer] = signers;
  const networkName = hre.network.name;
  console.log(`Starting deployment on network: ${networkName}`);
  console.log("Deploying contracts with the account:", deployer.address);

  let trustedForwarder = process.env.TRUSTED_FORWARDER;

  if (!trustedForwarder || trustedForwarder === "0x0000000000000000000000000000000000000000") {
    console.log("No Trusted Forwarder provided. Deploying a new GlobalAssetForwarder...");
    const GlobalAssetForwarder = await hre.ethers.getContractFactory("GlobalAssetForwarder");
    const forwarder = await GlobalAssetForwarder.deploy();
    await forwarder.waitForDeployment();
    trustedForwarder = await forwarder.getAddress();
    console.log("GlobalAssetForwarder deployed to:", trustedForwarder);
  }

  console.log("Deploying GlobalAssetUSDT...");
  const GlobalAssetUSDT = await hre.ethers.getContractFactory("GlobalAssetUSDT");
  const token = await GlobalAssetUSDT.deploy(trustedForwarder);

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("GlobalAssetUSDT (USDT Simulator) deployed to:", tokenAddress);
  console.log("Trusted Forwarder used:", trustedForwarder);
  console.log("Initial supply minted to:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
