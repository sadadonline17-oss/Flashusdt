# Asset Spoofing Simulation Environment

This repository contains a smart contract and scripts for simulating digital assets (specifically USDT) for security research and red teaming purposes.

## Project Structure

- `contracts/TetherUSD.sol`: A mock USDT contract (ERC-20) with 6 decimals and permissioned minting.
- `scripts/deploy.js`: Script to deploy the contract to an Ethereum-compatible network.
- `scripts/mint.js`: Script to mint tokens to a specific wallet.
- `.github/workflows/deploy.yml`: GitHub Actions workflow for automated deployment.
- `test/TetherUSD.js`: Unit tests for the smart contract.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your credentials:
   ```
   SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY
   ```

## Usage

### Compile
```bash
npx hardhat compile
```

### Test
```bash
npx hardhat test
```

### Deploy to Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Mint Tokens
Set the environment variables and run the script:
```bash
CONTRACT_ADDRESS=0x... RECIPIENT_ADDRESS=0x... AMOUNT=1000 npx hardhat run scripts/mint.js --network sepolia
```

## GitHub Actions Integration

To use the automated deployment, add the following secrets to your GitHub repository:
- `SEPOLIA_URL`: Your RPC URL for the Sepolia network.
- `PRIVATE_KEY`: The private key of the account that will deploy the contract.

The workflow will trigger on every push to the `main` branch.

## Security Disclaimer

This code is for **research and testing purposes only**. Using these scripts to create tokens that impersonate real assets on public networks with the intent to deceive others is illegal and unethical.
