import React, { useState, useEffect } from 'react';

const LiquidityComponent = ({ onAddLiquidity }) => {
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');
  const [pairExists, setPairExists] = useState(false);
  const [poolShare, setPoolShare] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  
  // Sample token list
  const commonTokens = [
    { symbol: 'ETH', name: 'Ethereum', address: 'native', logo: '⟠', balance: '1.2345' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', logo: '💵', balance: '2500.00' },
    { symbol: 'USDT', name: 'Tether', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', logo: '💲', balance: '1750.50' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6b175474e89094c44da98b954eedeac495271d0f', logo: '🔶', balance: '3200.75' },
  ];

  // Simulate checking if a pair already exists when tokens change
  useEffect(() => {
    if (token1 && token2 && token1 !== token2) {
      // In a real app, you'd call the smart contract to check
      setTimeout(() => {
        setPairExists(Math.random() > 0.5); // Random for demo
      }, 500);
    } else {
      setPairExists(false);
    }
  }, [token1, token2]);

  // Simulate calculating the pool share
  useEffect(() => {
    if (token1Amount && token2Amount && token1 && token2 && token1 !== token2) {
      // Simulate API call to get pool stats
      setIsBalanceLoading(true);
      setTimeout(() => {
        // Calculate estimated pool share (this would come from the blockchain in a real app)
        const estimatedShare = (parseFloat(token1Amount) / (parseFloat(token1Amount) + 1000)) * 100;
        setPoolShare(estimatedShare > 100 ? 100 : estimatedShare.toFixed(2));
        setIsBalanceLoading(false);
      }, 700);
    } else {
      setPoolShare(null);
    }
  }, [token1Amount, token2Amount, token1, token2]);

  // Helper function to get token balance
  const getTokenBalance = (symbol) => {
    const token = commonTokens.find(t => t.symbol === symbol);
    return token ? token.balance : '0';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!token1Amount || !token2Amount || !token1 || !token2) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Call the onAddLiquidity function passed from parent
    if (onAddLiquidity) {
      onAddLiquidity(token1, token2, token1Amount, token2Amount);
    } else {
      // For demo purposes
      alert(`Adding liquidity: ${token1Amount} ${token1} and ${token2Amount} ${token2}`);
    }
  };

  return (
    <div className="form-container liquidity-container">
      <div className="form-header">
        <h2>Add Liquidity</h2>
        <div className="settings-button">⚙️</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="token-selection-section">
          <div className="token-pair-header">
            <h3>Choose token pair</h3>
            {pairExists && <span className="pair-exists-badge">Pair Exists</span>}
          </div>
          
          <div className="token-pair-selectors">
            <div className="token-selector-wrapper">
              <select 
                value={token1} 
                onChange={(e) => setToken1(e.target.value)}
                className="token-select"
              >
                <option value="">Select first token</option>
                {commonTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.logo} {token.symbol}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="token-pair-separator">+</div>
            
            <div className="token-selector-wrapper">
              <select 
                value={token2} 
                onChange={(e) => setToken2(e.target.value)}
                className="token-select"
              >
                <option value="">Select second token</option>
                {commonTokens.map(token => (
                  <option key={token.symbol} value={token.symbol} disabled={token.symbol === token1}>
                    {token.logo} {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {token1 && token2 && (
          <div className="deposit-amounts-section">
            <h3>Deposit Amounts</h3>
            
            <div className="token-input-container">
              <div className="token-input-header">
                <label className="form-label">{token1}</label>
                <span className="token-balance">Balance: {getTokenBalance(token1)}</span>
              </div>
              <div className="token-input-wrapper">
                <input 
                  type="number" 
                  className="form-control token-amount-input" 
                  value={token1Amount} 
                  onChange={(e) => setToken1Amount(e.target.value)} 
                  placeholder="0.0" 
                  step="0.000001"
                  min="0"
                />
                <button 
                  type="button" 
                  className="max-button"
                  onClick={() => setToken1Amount(getTokenBalance(token1))}
                >
                  MAX
                </button>
              </div>
            </div>
            
            <div className="token-input-container">
              <div className="token-input-header">
                <label className="form-label">{token2}</label>
                <span className="token-balance">Balance: {getTokenBalance(token2)}</span>
              </div>
              <div className="token-input-wrapper">
                <input 
                  type="number" 
                  className="form-control token-amount-input" 
                  value={token2Amount} 
                  onChange={(e) => setToken2Amount(e.target.value)} 
                  placeholder="0.0" 
                  step="0.000001"
                  min="0"
                />
                <button 
                  type="button" 
                  className="max-button"
                  onClick={() => setToken2Amount(getTokenBalance(token2))}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>
        )}
        
        {poolShare !== null && (
          <div className="pool-info-container">
            <div className="pool-info-item">
              <span className="info-label">Estimated Pool Share:</span>
              <span className="info-value">{isBalanceLoading ? 'Calculating...' : `${poolShare}%`}</span>
            </div>
            <div className="pool-info-item">
              <span className="info-label">Pool Tokens You'll Receive:</span>
              <span className="info-value">{isBalanceLoading ? 'Calculating...' : `≈ ${(parseFloat(token1Amount) * 0.01).toFixed(6)} LP`}</span>
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className="form-button liquidity-button"
          disabled={!token1Amount || !token2Amount || !token1 || !token2 || token1 === token2 || isBalanceLoading}
        >
          {!token1 || !token2 ? 'Select Tokens' : 
           !token1Amount || !token2Amount ? 'Enter Amounts' : 
           token1 === token2 ? 'Invalid Pair' : 
           isBalanceLoading ? 'Calculating...' : 
           'Add Liquidity'}
        </button>
      </form>
    </div>
  );
};

export default LiquidityComponent;