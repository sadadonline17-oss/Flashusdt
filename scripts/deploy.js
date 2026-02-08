import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying MockUSDT...");

  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();

  await usdt.waitForDeployment();

  const address = await usdt.getAddress();
  console.log(`MockUSDT deployed to: ${address}`);

  // Save the address and ABI for the frontend
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ MockUSDT: address }, undefined, 2)
  );

  const MockUSDTArtifact = hre.artifacts.readArtifactSync("MockUSDT");
  fs.writeFileSync(
    path.join(contractsDir, "MockUSDT.json"),
    JSON.stringify(MockUSDTArtifact, undefined, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
