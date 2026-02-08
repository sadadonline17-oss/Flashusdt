import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MockUSDTABI from './contracts/MockUSDT.json';
import contractAddress from './contracts/contract-address.json';

function App() {
  const [targetAddress, setTargetAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setAccount(accounts[0]);

        const usdtContract = new ethers.Contract(
          contractAddress.MockUSDT,
          MockUSDTABI.abi,
          signer
        );
        setContract(usdtContract);
      } catch (err) {
        console.error("Error connecting wallet", err);
        setStatus("فشل الاتصال بالمحفظة");
      }
    } else {
      setStatus("يرجى تثبيت MetaMask");
    }
  }

  async function handleSimulate() {
    if (!contract) return;
    setStatus("جاري تنفيذ العملية...");
    try {
      // USDT has 6 decimals
      const amountInUnits = ethers.parseUnits(amount, 6);
      const tx = await contract.mint(targetAddress, amountInUnits);
      await tx.wait();
      setStatus(`تم بنجاح! تم إرسال ${amount} USDT إلى ${targetAddress}`);
    } catch (err: any) {
      console.error(err);
      setStatus(`خطأ: ${err.message}`);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', direction: 'rtl', textAlign: 'right' }}>
      <h1>لوحة تحكم محاكاة الأصول (Asset Spoofing Simulation)</h1>
      <p>الحساب المتصل: {account}</p>
      <p>عنوان العقد: {contractAddress.MockUSDT}</p>

      <div style={{ marginBottom: '10px' }}>
        <label>عنوان الهدف:</label><br />
        <input
          type="text"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          placeholder="0x..."
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>الكمية المراد محاكاتها (USDT):</label><br />
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
          placeholder="1000"
        />
      </div>

      <button
        onClick={handleSimulate}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        تنفيذ المحاكاة
      </button>

      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        {status}
      </div>
    </div>
  );
}

export default App;
