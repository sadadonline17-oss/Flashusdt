const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No deployment account found. Please check your PRIVATE_KEY in .env or GitHub Secrets.");
  }
  const [deployer] = signers;
  console.log("Deploying contracts with the account:", deployer.address);

  let trustedForwarder = process.env.TRUSTED_FORWARDER;

  if (!trustedForwarder || trustedForwarder === "0x0000000000000000000000000000000000000000") {
    console.log("No Trusted Forwarder provided. Deploying a new SecurityForwarder...");
    const SecurityForwarder = await hre.ethers.getContractFactory("SecurityForwarder");
    const forwarder = await SecurityForwarder.deploy();
    await forwarder.waitForDeployment();
    trustedForwarder = await forwarder.getAddress();
    console.log("SecurityForwarder deployed to:", trustedForwarder);
  }

  const SecurityUSDT = await hre.ethers.getContractFactory("SecurityUSDT");
  console.log("Deploying SecurityUSDT...");

  const token = await SecurityUSDT.deploy(trustedForwarder);

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("SecurityUSDT deployed to:", tokenAddress);
  console.log("Trusted Forwarder used:", trustedForwarder);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
