const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Relayer configuration
const PRIVATE_KEY = process.env.RELAYER_PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL;
const FORWARDER_ADDRESS = process.env.TRUSTED_FORWARDER;

if (!PRIVATE_KEY || !RPC_URL || !FORWARDER_ADDRESS) {
    console.error("Missing environment variables for relayer");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);
const relayerWallet = new ethers.Wallet(PRIVATE_KEY, provider);

// OZ 5.x ERC2771Forwarder ABI
const FORWARDER_ABI = [
    {
        "inputs": [
            {
                "components": [
                    { "internalType": "address", "name": "from", "type": "address" },
                    { "internalType": "address", "name": "to", "type": "address" },
                    { "internalType": "uint256", "name": "value", "type": "uint256" },
                    { "internalType": "uint256", "name": "gas", "type": "uint256" },
                    { "internalType": "uint48", "name": "deadline", "type": "uint48" },
                    { "internalType": "bytes", "name": "data", "type": "bytes" },
                    { "internalType": "bytes", "name": "signature", "type": "bytes" }
                ],
                "internalType": "struct ERC2771Forwarder.ForwardRequestData",
                "name": "request",
                "type": "tuple"
            }
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

const forwarder = new ethers.Contract(FORWARDER_ADDRESS, FORWARDER_ABI, relayerWallet);

app.post("/relay", async (req, res) => {
    const { request } = req.body;

    console.log("Received relay request from:", request.from);

    try {
        // In ethers v6, we can just pass the object that matches the struct
        const tx = await forwarder.execute(request);

        console.log("Transaction sent:", tx.hash);
        res.json({ success: true, txHash: tx.hash });

        tx.wait().then(() => console.log("Transaction confirmed:", tx.hash));

    } catch (error) {
        console.error("Relay failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Relayer server running on port ${PORT}`);
});
