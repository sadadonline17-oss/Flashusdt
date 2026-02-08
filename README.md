# Global Asset Simulator

The **Global Asset Simulator** is a turnkey Web3 security research solution designed for Red-Teaming environments. It provides a highly realistic simulation of the USDT (Tether USD) protocol, integrated with advanced features like EIP-2612 (Permit) and EIP-2771 (Meta-Transactions) to enable gasless operations.

## Features

- **Multi-Chain Support**: Ready-to-deploy on Sepolia, BNB Smart Chain, Polygon, and Base.
- **Gasless Transactions**: Integrated with `ERC2771Context` and a dedicated `SecurityForwarder` to allow users to interact with the contract without paying gas fees.
- **USDT Simulation**: Mimics USDT metadata (6 decimals, "Tether USD" name, "USDT" symbol) for realistic testing.
- **EIP-2612 Permit**: Allows for signature-based approvals, reducing friction and gas usage.
- **Autonomous CI/CD**: Automatic compilation and deployment via GitHub Actions.

## Project Structure

- `contracts/GlobalAssetUSDT.sol`: The core ERC20 token simulating USDT.
- `contracts/SecurityForwarder.sol`: The EIP-2771 trusted forwarder.
- `scripts/deploy.js`: Automated deployment script with network detection.
- `hardhat.config.js`: Multi-chain infrastructure configuration.
- `.github/workflows/deploy.yml`: CI/CD pipeline for automated deployments.

## Setup & Deployment

### Prerequisites

- Node.js (v20+)
- NPM

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory and add the following:

```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://rpc.sepolia.org
BSC_RPC_URL=https://bsc-dataseed.binance.org/
POLYGON_RPC_URL=https://polygon-rpc.com
BASE_RPC_URL=https://mainnet.base.org
TRUSTED_FORWARDER=0x... (optional)
```

### Manual Deployment

To deploy to a specific network:

```bash
npx hardhat run scripts/deploy.js --network <network_name>
```

Replace `<network_name>` with `sepolia`, `bsc`, `polygon`, or `base`.

### Running Tests

```bash
npm test
```

## Security Note

This project is intended for **security research and red-teaming environments only**. It allows for the simulation of asset transfers and permit-based attacks to test the resilience of digital wallets and security monitoring systems.

## License

MIT
