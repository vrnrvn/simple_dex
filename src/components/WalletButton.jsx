import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [chainId, setChainId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const networks = {
    1: 'Ethereum',
    56: 'BSC',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism'
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(accounts[0]);
            
            setIsConnected(true);
            setAccountAddress(accounts[0]);
            setChainId(network.chainId);
            setAccountBalance(ethers.utils.formatEther(balance).substring(0, 7));
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };
    
    checkConnection();
    
    // Add event listeners for account and chain changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);
  
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setIsConnected(false);
      setAccountAddress('');
      setAccountBalance('');
    } else {
      // Account changed, update state
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      
      setIsConnected(true);
      setAccountAddress(accounts[0]);
      setAccountBalance(ethers.utils.formatEther(balance).substring(0, 7));
    }
  };
  
  const handleChainChanged = (chainIdHex) => {
    // When the chain changes, reload the page as recommended by MetaMask
    window.location.reload();
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);
        
        setIsConnected(true);
        setAccountAddress(address);
        setChainId(network.chainId);
        setAccountBalance(ethers.utils.formatEther(balance).substring(0, 7));
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        
        // More user-friendly error handling
        if (error.code === 4001) {
          // User rejected the request
          showToast('Connection rejected by user', 'error');
        } else {
          showToast(`Failed to connect: ${error.message}`, 'error');
        }
      }
    } else {
      showToast('Please install MetaMask to use this app', 'error');
    }
  };
  
  const disconnectWallet = () => {
    // Note: There's no standard way to disconnect a wallet
    // This is a UI-only disconnect
    setIsConnected(false);
    setAccountAddress('');
    setAccountBalance('');
    setDropdownOpen(false);
    showToast('Wallet disconnected', 'success');
  };
  
  // Simple toast notification function
  const showToast = (message, type) => {
    // In a real app, use a proper toast notification system
    // This is just a placeholder implementation
    alert(message);
  };
  
  const getShortAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(accountAddress)
      .then(() => showToast('Address copied to clipboard!', 'success'))
      .catch(err => showToast('Failed to copy address', 'error'));
    
    setDropdownOpen(false);
  };
  
  const switchNetwork = async (newChainId) => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(newChainId).toString(16)}` }],
      });
    } catch (error) {
      showToast(`Failed to switch network: ${error.message}`, 'error');
    }
  };

  if (!isConnected) {
    return (
      <button onClick={connectWallet} className="wallet-button">
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="wallet-connected-container">
      <button 
        className="wallet-button connected"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="wallet-info">
          <div className="wallet-balance">{accountBalance} ETH</div>
          <div className="wallet-address">{getShortAddress(accountAddress)}</div>
        </div>
        <div className="network-badge">
          {networks[chainId] || `Chain ID: ${chainId}`}
        </div>
      </button>
      
      {dropdownOpen && (
        <div className="wallet-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-title">Account</div>
            <div className="dropdown-close" onClick={() => setDropdownOpen(false)}>×</div>
          </div>
          <div className="dropdown-address" onClick={copyAddressToClipboard}>
            {getShortAddress(accountAddress)} <span className="copy-icon">📋</span>
          </div>
          <div className="dropdown-balance">
            Balance: {accountBalance} ETH
          </div>
          <div className="dropdown-networks">
            <div className="dropdown-section-title">Networks</div>
            <div className="network-options">
              {Object.entries(networks).map(([id, name]) => (
                <div 
                  key={id}
                  className={`network-option ${Number(chainId) === Number(id) ? 'active' : ''}`}
                  onClick={() => switchNetwork(id)}
                >
                  {name}
                  {Number(chainId) === Number(id) && <span className="check-icon">✓</span>}
                </div>
              ))}
            </div>
          </div>
          <button className="disconnect-button" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;