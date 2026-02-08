const hre = require("hardhat");

async function main() {
  console.log("Deploying TetherUSD...");

  const TetherUSD = await hre.ethers.getContractFactory("TetherUSD");
  const tether = await TetherUSD.deploy();

  await tether.waitForDeployment();

  const address = await tether.getAddress();
  console.log(`TetherUSD deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
