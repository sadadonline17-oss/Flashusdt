const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const signers = await hre.ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No deployment account found. Please check your PRIVATE_KEY in .env or GitHub Secrets.");
  }
  const [deployer] = signers;
  const networkName = hre.network.name;

  console.log("====================================================");
  console.log(`Starting deployment on network: ${networkName}`);

  // Mask the address for logging (show first 6 and last 4)
  // We use getAddress to ensure it is in a standard checksum format
  const addr = hre.ethers.getAddress(deployer.address);
  const maskedAddr = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  console.log("Deploying contracts with the account:", maskedAddr);

  // Basic balance check
  const balance = await hre.ethers.provider.getBalance(addr);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n && networkName !== "hardhat" && networkName !== "localhost") {
    console.warn("WARNING: Deployer account has 0 ETH. Deployment might fail due to out of gas.");
  }

  let trustedForwarder = process.env.TRUSTED_FORWARDER;

  if (!trustedForwarder || trustedForwarder === "0x0000000000000000000000000000000000000000") {
    console.log("No Trusted Forwarder provided. Deploying a new GlobalAssetForwarder...");
    const GlobalAssetForwarder = await hre.ethers.getContractFactory("GlobalAssetForwarder");
    const forwarder = await GlobalAssetForwarder.deploy();
    await forwarder.waitForDeployment();
    trustedForwarder = await forwarder.getAddress();
    console.log("GlobalAssetForwarder deployed to:", trustedForwarder);
  } else {
    console.log("Using existing Trusted Forwarder at:", trustedForwarder);
  }

  console.log("Deploying GlobalAssetUSDT...");
  const GlobalAssetUSDT = await hre.ethers.getContractFactory("GlobalAssetUSDT");
  const token = await GlobalAssetUSDT.deploy(trustedForwarder);

  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("GlobalAssetUSDT (USDT Simulator) deployed to:", tokenAddress);
  console.log("Trusted Forwarder used:", trustedForwarder);
  console.log("Initial supply minted to:", maskedAddr);
  console.log("====================================================");

  // Export deployment info for the frontend and relayer
  const deploymentsDir = path.join(__dirname, "..", "frontend", "src", "abis");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const tokenArtifact = await hre.artifacts.readArtifact("GlobalAssetUSDT");
  const forwarderArtifact = await hre.artifacts.readArtifact("GlobalAssetForwarder");

  const deploymentInfo = {
    network: networkName,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contracts: {
      GlobalAssetUSDT: {
        address: tokenAddress,
        abi: tokenArtifact.abi
      },
      GlobalAssetForwarder: {
        address: trustedForwarder,
        abi: forwarderArtifact.abi
      }
    }
  };

  fs.writeFileSync(
    path.join(deploymentsDir, `deployment_${networkName}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`Deployment info saved to frontend/src/abis/deployment_${networkName}.json`);
}

main().catch((error) => {
  console.error("Deployment failed!");
  console.error(error);
  process.exitCode = 1;
});
