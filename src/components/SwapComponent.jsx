import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const SwapComponent = ({ onSwap }) => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample token list - in a real app, you'd fetch this from an API
  const commonTokens = [
    { symbol: 'ETH', name: 'Ethereum', address: 'native', logo: '⟠' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', logo: '💵' },
    { symbol: 'USDT', name: 'Tether', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', logo: '💲' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6b175474e89094c44da98b954eedeac495271d0f', logo: '🔶' },
  ];

  // Simulate getting a quote when inputs change
  useEffect(() => {
    if (fromAmount && fromAmount > 0 && fromToken && toToken) {
      // Simulate API call to get exchange rate
      setIsLoading(true);
      
      // For demo, just use a random exchange rate
      setTimeout(() => {
        // Simple mock exchange rate calculation
        const mockRate = fromToken === 'ETH' ? 1800 + Math.random() * 200 : 1 / (1 + Math.random() * 0.1);
        setExchangeRate(mockRate);
        setToAmount((parseFloat(fromAmount) * mockRate).toFixed(6));
        setIsLoading(false);
      }, 500);
    } else {
      setToAmount('');
      setExchangeRate(null);
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSwapTokens = () => {
    // Swap the from and to tokens
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Clear amounts to trigger a new quote
    setFromAmount('');
    setToAmount('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!fromAmount || !toToken || !fromToken) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Call the onSwap function passed from parent
    if (onSwap) {
      onSwap(fromToken, toToken, fromAmount, slippage);
    } else {
      // For demo purposes
      alert(`Swapping ${fromAmount} ${fromToken} for approximately ${toAmount} ${toToken} with ${slippage}% slippage tolerance`);
    }
  };

  return (
    <div className="form-container swap-container">
      <div className="form-header">
        <h2>Swap Tokens</h2>
        <div className="settings-button">⚙️</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="token-input-container">
          <label className="form-label">You Pay</label>
          <div className="token-input-wrapper">
            <input 
              type="number" 
              className="form-control token-amount-input" 
              value={fromAmount} 
              onChange={(e) => setFromAmount(e.target.value)} 
              placeholder="0.0" 
              step="0.000001"
              min="0"
            />
            <div className="token-selector">
              <select 
                value={fromToken} 
                onChange={(e) => setFromToken(e.target.value)}
                className="token-select"
              >
                <option value="">Select token</option>
                {commonTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.logo} {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="swap-direction-button" onClick={handleSwapTokens}>
          <span>⇅</span>
        </div>
        
        <div className="token-input-container">
          <label className="form-label">You Receive</label>
          <div className="token-input-wrapper">
            <input 
              type="text" 
              className="form-control token-amount-input" 
              value={isLoading ? 'Loading...' : toAmount} 
              readOnly 
              placeholder="0.0" 
            />
            <div className="token-selector">
              <select 
                value={toToken} 
                onChange={(e) => setToToken(e.target.value)}
                className="token-select"
              >
                <option value="">Select token</option>
                {commonTokens.map(token => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.logo} {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {exchangeRate && (
          <div className="exchange-rate-info">
            <span>Rate: 1 {fromToken} ≈ {exchangeRate.toFixed(6)} {toToken}</span>
          </div>
        )}
        
        <div className="slippage-container">
          <label className="form-label">Slippage Tolerance</label>
          <div className="slippage-options">
            <button 
              type="button" 
              className={`slippage-option ${slippage === 0.1 ? 'active' : ''}`}
              onClick={() => setSlippage(0.1)}
            >
              0.1%
            </button>
            <button 
              type="button" 
              className={`slippage-option ${slippage === 0.5 ? 'active' : ''}`}
              onClick={() => setSlippage(0.5)}
            >
              0.5%
            </button>
            <button 
              type="button" 
              className={`slippage-option ${slippage === 1.0 ? 'active' : ''}`}
              onClick={() => setSlippage(1.0)}
            >
              1.0%
            </button>
            <div className="custom-slippage">
              <input 
                type="number" 
                value={slippage} 
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                step="0.1"
                min="0.1"
                max="100"
              />
              <span>%</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="form-button swap-button"
          disabled={!fromAmount || !toToken || !fromToken || isLoading}
        >
          {isLoading ? 'Getting Best Price...' : 'Swap Tokens'}
        </button>
      </form>
    </div>
  );
};

export default SwapComponent;