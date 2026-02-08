import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import SecurityUSDT from './abis/SecurityUSDT.json';
import SecurityForwarder from './abis/SecurityForwarder.json';
import './App.css';

// These should be updated after deployment
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS || "";
const FORWARDER_ADDRESS = process.env.REACT_APP_FORWARDER_ADDRESS || "";
const RELAYER_URL = process.env.REACT_APP_RELAYER_URL || "http://localhost:3001/relay";

function App() {
  const [account, setAccount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (account && TOKEN_ADDRESS) {
      updateBalance();
    }
  }, [account]);

  const updateBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, SecurityUSDT.abi, provider);
      const bal = await tokenContract.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        setStatus("Connection failed");
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleGaslessTransfer = async () => {
    if (!account || !recipient || !amount) {
      alert("Please fill all fields");
      return;
    }

    if (!TOKEN_ADDRESS || !FORWARDER_ADDRESS) {
      alert("Contract addresses not set. Please deploy and update .env");
      return;
    }

    setStatus('Preparing gasless transfer...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tokenContract = new ethers.Contract(TOKEN_ADDRESS, SecurityUSDT.abi, provider);
      const forwarderContract = new ethers.Contract(FORWARDER_ADDRESS, SecurityForwarder.abi, provider);

      const amountWei = ethers.parseUnits(amount, 18);
      const data = tokenContract.interface.encodeFunctionData('transfer', [recipient, amountWei]);

      const nonce = await forwarderContract.nonces(account);
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

      const domain = {
        name: 'SecurityForwarder',
        version: '1',
        chainId: chainId,
        verifyingContract: FORWARDER_ADDRESS,
      };

      const types = {
        ForwardRequest: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'gas', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint48' },
          { name: 'data', type: 'bytes' },
        ],
      };

      const requestToSign = {
        from: account,
        to: TOKEN_ADDRESS,
        value: 0n,
        gas: 100000n,
        nonce: nonce,
        deadline: BigInt(deadline),
        data: data,
      };

      setStatus('Signing request (EIP-712)...');
      // Sign the request
      const signature = await signer.signTypedData(domain, types, requestToSign);

      const relayRequest = {
        from: account,
        to: TOKEN_ADDRESS,
        value: "0",
        gas: "100000",
        deadline: deadline,
        data: data,
        signature: signature
      };

      setStatus('Sending to relayer...');
      const response = await axios.post(RELAYER_URL, {
        request: relayRequest
      });

      if (response.data.success) {
        setStatus(`Success! Tx Hash: ${response.data.txHash}`);
        updateBalance();
      } else {
        setStatus(`Failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web3 Security Automation</h1>
        <p>منصة أتمتة أمن الويب 3 - Gasless Transactions</p>

        {!account ? (
          <button className="btn-primary" onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div className="container">
            <div className="card">
              <h3>Wallet Details</h3>
              <p>Address: <code>{account}</code></p>
              <p>Balance: <strong>{balance} sUSDT</strong></p>
            </div>

            <div className="card">
              <h3>Gasless Transfer</h3>
              <div className="input-group">
                <label>Recipient</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Amount</label>
                <input
                  type="text"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <button className="btn-success" onClick={handleGaslessTransfer}>Send (Gasless)</button>
            </div>

            {status && <div className="status-box">{status}</div>}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
