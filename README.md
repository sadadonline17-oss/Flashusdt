# Web3 Security Automation Platform (منصة أتمتة أمن الويب 3)

This is a turnkey solution for building and testing Web3 Security Automation with Gasless Transactions (Meta-transactions).

هذا المشروع هو حل متكامل يتضمن عقوداً ذكية، نظام ترحيل (Relayer)، وواجهة أمامية لدراسة وتنفيذ العمليات عديمة الغاز.

يتم تشغيل الاختبارات تلقائياً عبر GitHub Actions. لتفعيل النشر الآلي، قم بإضافة المفاتيح (Secrets) اللازمة في إعدادات المستودع.

## Components

1.  **Smart Contracts (`/contracts`)**:
    *   `SecurityUSDT.sol`: An ERC20 token implementing EIP-2612 (Permit) and GSN support (EIP-2771).
    *   `SecurityForwarder.sol`: A trusted forwarder for executing meta-transactions.
2.  **Deployment Automation (`/.github/workflows`)**:
    *   GitHub Actions workflow for automated deployment to Sepolia testnet.
3.  **Gasless Relayer (`/relayer`)**:
    *   A Node.js Express server that acts as a relayer, paying for gas on behalf of users.
4.  **Frontend (`/frontend`)**:
    *   A React application for interacting with the contracts and sending gasless transactions.

## Getting Started

### 1. Smart Contracts & Deployment

#### GitHub Actions Automation
This repository is configured to automatically run tests and deploy to Sepolia. To enable deployment, add the following to your **GitHub Repository Secrets**:
- `PRIVATE_KEY`: Your deployment wallet private key.
- `SEPOLIA_RPC_URL`: Your RPC provider URL (Alchemy, Infura, etc.).
- `TRUSTED_FORWARDER` (Optional): Address of an existing forwarder.

#### Manual Deployment
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Copy `.env.example` to `.env` and fill in your details:
    *   `PRIVATE_KEY`: Your deployment wallet private key.
    *   `SEPOLIA_RPC_URL`: Your Alchemy/Infura RPC URL.
    *   `TRUSTED_FORWARDER`: Leave empty to deploy a new one.
3.  Deploy:
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```

### 2. Gasless Relayer

1.  Navigate to `relayer/`:
    ```bash
    cd relayer
    npm install
    ```
2.  Copy `.env.example` to `.env` and fill in your details (Relayer needs funds to pay for gas).
3.  Start the relayer:
    ```bash
    node server.js
    ```

### 3. Frontend

1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    npm install
    ```
2.  Copy `.env.example` to `.env` and fill in the deployed contract addresses.
3.  Start the app:
    ```bash
    npm start
    ```

## Security Research

This platform is designed for studying:
*   Meta-transaction vulnerabilities (e.g., signature replay, front-running).
*   Gasless UX improvements.
*   EIP-712 typed data signing.

## License
MIT
