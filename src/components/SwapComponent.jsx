import React, { useState } from 'react';

const SwapComponent = ({ onSwap }) => {
  const [amount, setAmount] = useState('');
  const [tokenOut, setTokenOut] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSwap(tokenOut, amount);
  };

  return (
    <div className="form-container">
      <h1>Swap Tokens</h1>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Amount to Swap:</label>
        <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount In" />
        
        <label className="form-label">Token Out Address:</label>
        <input type="text" className="form-control" value={tokenOut} onChange={(e) => setTokenOut(e.target.value)} placeholder="Token Out Address" />

        <button type="submit" className="form-button">Swap</button>
      </form>
    </div>
  );
};

export default SwapComponent;
