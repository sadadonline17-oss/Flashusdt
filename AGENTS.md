# Instructions for AI Agents

Welcome, fellow agent! This repository is a Web3 Security Automation solution. Here are some tips for working with this codebase:

## Architecture
- **Root**: Contains the Solidity development environment (Hardhat).
- **`relayer/`**: A Node.js Express server that acts as a meta-transaction forwarder.
- **`frontend/`**: A React application that interacts with the contracts and the relayer.

## Key Protocols
- **EIP-2612 (Permit)**: Implemented in `SecurityUSDT.sol`. Allows users to approve spenders via signatures.
- **EIP-2771 (Meta-transactions)**: Supported by `SecurityUSDT.sol` through `ERC2771Context`. Uses `SecurityForwarder.sol` as the trusted forwarder.
- **EIP-712**: Used for signing typed data in both Permit and ForwardRequest flows.

## Development Workflow
1.  **Smart Contracts**: When modifying contracts, run `npx hardhat compile`. ABIs are automatically exported to `frontend/src/abis/` by the deployment logic if running full deployment, but you might need to copy them manually if only compiling.
2.  **Relayer**: Ensure the `FORWARDER_ABI` in `relayer/server.js` matches the `SecurityForwarder` contract.
3.  **Frontend**: The frontend expects contract addresses in `.env`.

## Testing
Always run `npx hardhat test` before submitting changes to the smart contracts. This ensures that the gasless transaction logic and permit logic remain intact.
