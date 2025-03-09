// WalletButton.jsx
import React from 'react';
import { ethers } from 'ethers';  // Correct import for using ethers.js

const WalletButton = () => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        alert('Wallet connected: ' + await signer.getAddress());  // Provide user feedback via alert (could be improved with UI elements)
      } catch (error) {
        alert('Failed to connect wallet: ' + error.message);  // User-friendly error message
      }
    } else {
      alert('Please install MetaMask to use this app.');  // User-friendly alert for missing MetaMask
    }
  };

  return <button onClick={connectWallet} className="wallet-button">Connect Wallet</button>;
};

export default WalletButton;
