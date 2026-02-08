const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;
  const AMOUNT = process.env.AMOUNT || "1000"; // Default 1000 USDT

  if (!CONTRACT_ADDRESS || !RECIPIENT_ADDRESS) {
    console.error("Please set CONTRACT_ADDRESS and RECIPIENT_ADDRESS environment variables");
    process.exit(1);
  }

  const TetherUSD = await hre.ethers.getContractFactory("TetherUSD");
  const tether = await TetherUSD.attach(CONTRACT_ADDRESS);

  // USDT has 6 decimals
  const amountWithDecimals = hre.ethers.parseUnits(AMOUNT, 6);

  console.log(`Minting ${AMOUNT} USDT to ${RECIPIENT_ADDRESS}...`);
  const tx = await tether.mint(RECIPIENT_ADDRESS, amountWithDecimals);
  await tx.wait();

  console.log("Minting complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
